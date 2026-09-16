import { BottomSheet, useBottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { useHaptics } from '@/hooks/useHaptics';
import { BORDER_RADIUS, CORNERS, FONT_SIZE, HEIGHT } from '@/theme/globals';
import {
  Calendar,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarRange,
  ArrowRight,
} from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface BaseDatePickerProps {
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
  minimumDate?: Date;
  maximumDate?: Date;
  timeFormat?: '12' | '24';
  variant?: 'filled' | 'outline' | 'group';
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  haptic?: boolean;
}

interface DatePickerPropsRange extends BaseDatePickerProps {
  mode: 'range';
  value?: DateRange;
  onChange?: (value: DateRange | undefined) => void;
}

interface DatePickerPropsDate extends BaseDatePickerProps {
  mode?: 'date' | 'time' | 'datetime';
  value?: Date;
  onChange?: (value: Date | undefined) => void;
}

export type DatePickerProps = DatePickerPropsRange | DatePickerPropsDate;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);

const isDateRange = (value: Date | DateRange | undefined): value is DateRange => {
  return value !== undefined && typeof value === 'object' && value !== null && 'startDate' in value && 'endDate' in value;
};

export function DatePicker(props: DatePickerProps) {
  const {
    label, error, placeholder = 'Select date', disabled = false, style,
    minimumDate, maximumDate, timeFormat = '24', variant = 'filled',
    labelStyle, errorStyle, haptic = true,
  } = props;

  const mode = props.mode || 'date';
  const value = props.value;
  const onChange = props.onChange;
  const feedback = useHaptics(haptic);
  const { isVisible, open, close } = useBottomSheet();

  const getCurrentDate = useCallback(() => {
    if (mode === 'range') {
      const rangeValue = isDateRange(value) ? value : { startDate: null, endDate: null };
      return rangeValue.startDate || new Date();
    }
    return (value as Date) || new Date();
  }, [value, mode]);

  const [currentDate, setCurrentDate] = useState(() => getCurrentDate());
  const [viewMode, setViewMode] = useState<'date' | 'time' | 'month' | 'year'>('date');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const [tempRange, setTempRange] = useState<DateRange>(() =>
    mode === 'range' && isDateRange(value) ? value : { startDate: null, endDate: null }
  );

  const cardColor = useColor('card');
  const borderColor = useColor('border');
  const primaryColor = useColor('primary');
  const primaryForegroundColor = useColor('primaryForeground');
  const mutedColor = useColor('muted');
  const textMutedColor = useColor('textMuted');
  const mutedForegroundColor = useColor('mutedForeground');
  const textColor = useColor('text');
  const errorColor = useColor('red');

  const formatDisplayValue = useCallback(() => {
    if (mode === 'range') {
      const rangeValue = isDateRange(value) ? value : { startDate: null, endDate: null };
      if (!rangeValue.startDate && !rangeValue.endDate) return placeholder;
      const startStr = rangeValue.startDate ? rangeValue.startDate.toLocaleDateString() : '';
      const endStr = rangeValue.endDate ? rangeValue.endDate.toLocaleDateString() : '';
      if (startStr && endStr) return `${startStr} - ${endStr}`;
      if (startStr) return `${startStr} - Pilih akhir`;
      if (endStr) return `Pilih awal - ${endStr}`;
      return placeholder;
    }
    const dateValue = value as Date;
    if (!dateValue) return placeholder;
    switch (mode) {
      case 'time':
        return dateValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12' });
      case 'datetime': {
        const timeStr = dateValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12' });
        return `${dateValue.toLocaleDateString()} ${timeStr}`;
      }
      default:
        return dateValue.toLocaleDateString();
    }
  }, [value, mode, placeholder, timeFormat]);

  const isDateDisabled = useCallback((date: Date) => {
    if (minimumDate && date < minimumDate) return true;
    if (maximumDate && date > maximumDate) return true;
    return false;
  }, [minimumDate, maximumDate]);

  const isDateInRange = useCallback((date: Date) => {
    if (mode !== 'range' || !tempRange.startDate || !tempRange.endDate) return false;
    const s = new Date(tempRange.startDate); s.setHours(0,0,0,0);
    const e = new Date(tempRange.endDate); e.setHours(0,0,0,0);
    const c = new Date(date); c.setHours(0,0,0,0);
    return c >= s && c <= e;
  }, [mode, tempRange]);

  const isRangeEndpoint = useCallback((date: Date) => {
    if (mode !== 'range') return { isStart: false, isEnd: false };
    const n = new Date(date); n.setHours(0,0,0,0);
    const isStart = tempRange.startDate && new Date(tempRange.startDate).setHours(0,0,0,0) === n.getTime();
    const isEnd = tempRange.endDate && new Date(tempRange.endDate).setHours(0,0,0,0) === n.getTime();
    return { isStart: !!isStart, isEnd: !!isEnd };
  }, [mode, tempRange]);

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) currentWeek.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) { weeks.push([...currentWeek]); currentWeek = []; }
    }
    if (currentWeek.length > 0) { while (currentWeek.length < 7) currentWeek.push(null); weeks.push(currentWeek); }
    return { weeks, year, month, daysInMonth };
  }, [currentDate]);

  const handleRangeSelect = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (isDateDisabled(selectedDate)) return;
    feedback('selection');
    if (!tempRange.startDate || (tempRange.startDate && tempRange.endDate)) {
      setTempRange({ startDate: selectedDate, endDate: null });
    } else {
      if (selectedDate < tempRange.startDate) setTempRange({ startDate: selectedDate, endDate: null });
      else setTempRange({ startDate: tempRange.startDate, endDate: selectedDate });
    }
  };

  const handleDateSelect = (day: number) => {
    if (mode === 'range') { handleRangeSelect(day); return; }
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day,
      mode === 'datetime' ? currentDate.getHours() : 0,
      mode === 'datetime' ? currentDate.getMinutes() : 0
    );
    if (isDateDisabled(newDate)) return;
    feedback('selection');
    setCurrentDate(newDate);
    if (mode === 'date') { (onChange as (v: Date | undefined) => void)?.(newDate); close(); }
    else if (mode === 'datetime') setViewMode('time');
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    feedback('tick');
    const newDate = new Date(currentDate);
    newDate.setHours(hours, minutes, 0, 0);
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    feedback('tick');
    const newDate = new Date(currentDate);
    if (direction === 'prev') newDate.setMonth(newDate.getMonth() - 1);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleMonthSelect = (monthIndex: number) => {
    feedback('selection');
    const newDate = new Date(currentDate); newDate.setMonth(monthIndex);
    setCurrentDate(newDate); setShowMonthPicker(false);
  };

  const handleYearSelect = (year: number) => {
    feedback('selection');
    const newDate = new Date(currentDate); newDate.setFullYear(year);
    setCurrentDate(newDate); setShowYearPicker(false);
  };

  const handleConfirm = () => {
    feedback('success');
    if (mode === 'range') (onChange as (v: DateRange | undefined) => void)?.(tempRange);
    else (onChange as (v: Date | undefined) => void)?.(currentDate);
    close();
  };

  const resetToToday = () => {
    const today = new Date(); setCurrentDate(today);
    if (mode === 'range') setTempRange({ startDate: today, endDate: null });
    else if (mode === 'date') { (onChange as (v: Date | undefined) => void)?.(today); close(); }
  };

  const clearSelection = () => {
    if (mode === 'range') { setTempRange({ startDate: null, endDate: null }); (onChange as (v: DateRange | undefined) => void)?.(undefined); }
    else (onChange as (v: Date | undefined) => void)?.(undefined);
  };

  const handleOpenPicker = () => {
    feedback('impact-light');
    setCurrentDate(new Date()); setViewMode('date');
    setShowMonthPicker(false); setShowYearPicker(false);
    open();
  };

  const triggerStyle: ViewStyle = {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: variant === 'group' ? 0 : 16,
    borderWidth: variant === 'group' ? 0 : 1,
    borderColor: variant === 'outline' ? borderColor : cardColor,
    borderRadius: CORNERS,
    backgroundColor: variant === 'filled' ? cardColor : 'transparent',
    minHeight: variant === 'group' ? 'auto' : HEIGHT,
  };

  // ─── Calendar ───
  const renderMonthYearHeader = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 4 }}>
      <TouchableOpacity onPress={() => navigateMonth('prev')} style={{ padding: 8, borderRadius: CORNERS, backgroundColor: mutedColor }}>
        <ChevronLeft size={18} color={textColor} />
      </TouchableOpacity>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginHorizontal: 8 }}>
        <TouchableOpacity onPress={() => setShowMonthPicker(true)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 8, borderRadius: CORNERS, backgroundColor: mutedColor }}>
          <Text variant='subtitle' style={{ fontSize: 13, marginRight: 2 }}>{MONTHS[calendarData.month]}</Text>
          <ChevronDown size={14} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowYearPicker(true)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 8, borderRadius: CORNERS, backgroundColor: mutedColor }}>
          <Text variant='subtitle' style={{ fontSize: 13, marginRight: 2 }}>{calendarData.year}</Text>
          <ChevronDown size={14} color={textColor} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigateMonth('next')} style={{ padding: 8, borderRadius: CORNERS, backgroundColor: mutedColor }}>
        <ChevronRight size={18} color={textColor} />
      </TouchableOpacity>
    </View>
  );

  const renderCalendar = () => (
    <View>
      {renderMonthYearHeader()}
      <View style={{ flexDirection: 'row', marginBottom: 8, paddingHorizontal: 2 }}>
        {DAYS.map((d) => (<View key={d} style={{ flex: 1, alignItems: 'center' }}><Text variant='caption' style={{ fontSize: 11, fontWeight: '600' }}>{d}</Text></View>))}
      </View>
      <View style={{ paddingHorizontal: 2 }}>
        {calendarData.weeks.map((week, wi) => (
          <View key={wi} style={{ flexDirection: 'row', marginBottom: 2 }}>
            {week.map((day, di) => {
              const dayDate = day ? new Date(calendarData.year, calendarData.month, day) : null;
              const isSelected = day && value && !isDateRange(value) && value.getDate() === day && value.getMonth() === calendarData.month && value.getFullYear() === calendarData.year;
              const isToday = day && new Date().getDate() === day && new Date().getMonth() === calendarData.month && new Date().getFullYear() === calendarData.year;
              const disabled = dayDate ? isDateDisabled(dayDate) : false;
              const inRange = dayDate ? isDateInRange(dayDate) : false;
              const ep = dayDate ? isRangeEndpoint(dayDate) : { isStart: false, isEnd: false };
              return (
                <View key={di} style={[{ flex: 1, alignItems: 'center', backgroundColor: mode === 'range' && inRange ? primaryColor : 'transparent' }, ep.isStart && { borderTopLeftRadius: CORNERS, borderBottomLeftRadius: CORNERS }, ep.isEnd && { borderTopRightRadius: CORNERS, borderBottomRightRadius: CORNERS }]}>
                  {day ? (
                    <TouchableOpacity onPress={() => !disabled && handleDateSelect(day)} disabled={disabled} style={[{ width: 36, height: 36, borderRadius: ep.isStart || ep.isEnd ? 0 : CORNERS, backgroundColor: ep.isStart || ep.isEnd ? primaryColor : inRange ? primaryColor : isSelected ? primaryColor : 'transparent', borderWidth: isToday && !isSelected && !inRange ? 1 : 0, borderColor: primaryColor, justifyContent: 'center', alignItems: 'center', opacity: disabled ? 0.3 : 1 }, ep.isStart && { borderTopLeftRadius: CORNERS, borderBottomLeftRadius: CORNERS }, ep.isEnd && { borderTopRightRadius: CORNERS, borderBottomRightRadius: CORNERS }]}>
                      <Text style={{ color: ep.isStart || ep.isEnd ? primaryForegroundColor : inRange ? primaryForegroundColor : isSelected ? primaryForegroundColor : disabled ? mutedForegroundColor : textColor, fontWeight: ep.isStart || ep.isEnd || isSelected || isToday ? '600' : '400', fontSize: FONT_SIZE - 1 }}>{day}</Text>
                    </TouchableOpacity>
                  ) : <View style={{ width: 36, height: 36 }} />}
                </View>
              );
            })}
          </View>
        ))}
      </View>
      {mode === 'range' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, padding: 16, backgroundColor: mutedColor, borderRadius: BORDER_RADIUS }}>
          <Text variant='subtitle' style={{ flex: 1, fontSize: 13 }}>{tempRange.startDate ? tempRange.startDate.toLocaleDateString() : 'Mulai'}</Text>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ArrowRight color={textColor} strokeWidth={3} /></View>
          <Text variant='subtitle' style={{ flex: 1, textAlign: 'right', fontSize: 13 }}>{tempRange.endDate ? tempRange.endDate.toLocaleDateString() : 'Selesai'}</Text>
        </View>
      )}
    </View>
  );

  // ─── Time Wheel ───
  const renderTimePicker = () => {
    const selectedHours = currentDate.getHours();
    const selectedMinutes = currentDate.getMinutes();
    const isPM = selectedHours >= 12;

    return (
      <View style={{ height: 300 }}>
        <View style={{ flexDirection: 'row', flex: 1, gap: 16 }}>
          {/* Hours */}
          <View style={{ flex: 1 }}>
            <Text variant='caption' style={{ textAlign: 'center', marginBottom: 12 }}>Jam</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
              {Array.from({ length: timeFormat === '12' ? 12 : 24 }, (_, i) =>
                timeFormat === '12' ? (i === 0 ? 12 : i) : i
              ).map((hour) => {
                const actualHour = timeFormat === '12'
                  ? hour === 12 ? (isPM ? 12 : 0) : (isPM ? hour + 12 : hour)
                  : hour;
                const isSelected = actualHour === selectedHours;
                return (
                  <TouchableOpacity key={hour} onPress={() => handleTimeChange(actualHour, selectedMinutes)} style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: CORNERS, backgroundColor: isSelected ? primaryColor : 'transparent', marginVertical: 2, alignItems: 'center' }}>
                    <Text style={{ color: isSelected ? primaryForegroundColor : textColor, fontWeight: isSelected ? '600' : '400', fontSize: FONT_SIZE }}>
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Minutes */}
          <View style={{ flex: 1 }}>
            <Text variant='caption' style={{ textAlign: 'center', marginBottom: 12 }}>Menit</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
              {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                <TouchableOpacity key={minute} onPress={() => handleTimeChange(selectedHours, minute)} style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: CORNERS, backgroundColor: minute === selectedMinutes ? primaryColor : 'transparent', marginVertical: 2, alignItems: 'center' }}>
                  <Text style={{ color: minute === selectedMinutes ? primaryForegroundColor : textColor, fontWeight: minute === selectedMinutes ? '600' : '400', fontSize: FONT_SIZE }}>
                    {minute.toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* AM/PM for 12h */}
          {timeFormat === '12' && (
            <View style={{ flex: 0.5 }}>
              <Text variant='caption' style={{ textAlign: 'center', marginBottom: 12 }}>Period</Text>
              <View style={{ paddingVertical: 20, gap: 8 }}>
                {['AM', 'PM'].map((period) => {
                  const isAM = period === 'AM';
                  const isSelected = isAM ? !isPM : isPM;
                  return (
                    <TouchableOpacity key={period} onPress={() => { const newHours = isAM ? (selectedHours >= 12 ? selectedHours - 12 : selectedHours) : (selectedHours < 12 ? selectedHours + 12 : selectedHours); handleTimeChange(newHours, selectedMinutes); }} style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: CORNERS, backgroundColor: isSelected ? primaryColor : 'transparent', alignItems: 'center' }}>
                      <Text style={{ color: isSelected ? primaryForegroundColor : textColor, fontWeight: isSelected ? '600' : '400', fontSize: FONT_SIZE }}>{period}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  // ─── Month / Year sub-pickers ───
  const renderMonthPicker = () => (
    <View style={{ height: 260 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 12 }}>
        {MONTHS.map((m, i) => (
          <TouchableOpacity key={m} onPress={() => handleMonthSelect(i)} style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: CORNERS, backgroundColor: i === calendarData.month ? primaryColor : 'transparent', marginVertical: 1, alignItems: 'center' }}>
            <Text style={{ color: i === calendarData.month ? primaryForegroundColor : textColor, fontWeight: i === calendarData.month ? '600' : '400', fontSize: FONT_SIZE }}>{m}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderYearPicker = () => (
    <View style={{ height: 260 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 12 }}>
        {YEARS.map((y) => (
          <TouchableOpacity key={y} onPress={() => handleYearSelect(y)} style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: CORNERS, backgroundColor: y === calendarData.year ? primaryColor : 'transparent', marginVertical: 1, alignItems: 'center' }}>
            <Text style={{ color: y === calendarData.year ? primaryForegroundColor : textColor, fontWeight: y === calendarData.year ? '600' : '400', fontSize: FONT_SIZE }}>{y}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const getPickerContent = () => {
    if (showMonthPicker) return renderMonthPicker();
    if (showYearPicker) return renderYearPicker();
    if (mode === 'datetime') return viewMode === 'date' ? renderCalendar() : renderTimePicker();
    if (mode === 'time') return renderTimePicker();
    return renderCalendar();
  };

  const getPickerTitle = () => {
    if (showMonthPicker) return 'Pilih Bulan';
    if (showYearPicker) return 'Pilih Tahun';
    if (mode === 'datetime') return viewMode === 'date' ? 'Pilih Tanggal' : 'Pilih Waktu';
    if (mode === 'time') return 'Pilih Waktu';
    if (mode === 'range') return 'Pilih Rentang';
    return 'Pilih Tanggal';
  };

  return (
    <>
      <TouchableOpacity
        style={[triggerStyle, disabled && { opacity: 0.5 }, style]}
        onPress={handleOpenPicker}
        disabled={disabled}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: label ? 120 : 'auto', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {mode === 'time' ? <Icon name={Clock} size={20} strokeWidth={1} />
              : mode === 'datetime' ? <Icon name={CalendarClock} size={20} strokeWidth={1} />
              : mode === 'range' ? <Icon name={CalendarRange} size={20} strokeWidth={1} />
              : <Icon name={Calendar} size={20} strokeWidth={1} />}
            {label && (
              <View style={{ flex: 1 }}>
                <Text variant='caption' numberOfLines={1} ellipsizeMode='tail' style={[{ color: error ? errorColor : textMutedColor }, labelStyle]}>{label}</Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: value ? textColor : textMutedColor, fontSize: FONT_SIZE }}>{formatDisplayValue()}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {error && <Text variant='caption' style={[{ color: errorColor, marginTop: 4, marginLeft: 14 }, errorStyle]}>{error}</Text>}

      <BottomSheet
        isVisible={isVisible}
        onClose={() => { close(); setShowMonthPicker(false); setShowYearPicker(false); }}
        title={getPickerTitle()}
        snapPoints={[0.7]}
        disablePanGesture
        disableHandleTap
      >
        <View style={{ flex: 1 }}>
          {getPickerContent()}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button variant='outline' onPress={resetToToday}>Hari Ini</Button>
              <Button variant='outline' onPress={() => { close(); setShowMonthPicker(false); setShowYearPicker(false); clearSelection(); }}>
                {mode === 'range' ? 'Hapus' : 'Batal'}
              </Button>
            </View>
            {mode === 'datetime' && viewMode === 'date' ? (
              <Button onPress={() => setViewMode('time')} style={{ flex: 1 }}>Selanjutnya</Button>
            ) : (
              <Button onPress={handleConfirm} haptic={false} style={{ flex: 1 }}>Selesai</Button>
            )}
          </View>
        </View>
      </BottomSheet>
    </>
  );
}
