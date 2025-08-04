/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import {
  FloatingPortal,
  FloatingFocusManager,
  useFloating,
  useListNavigation,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  offset,
} from '@floating-ui/react';
import { Box } from '~components/Box';
import { TimeInput } from '@mantine/dates';
import { ClockIcon } from '~components/Icons';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';

function TimePicker({
  label,
  value: initialValue = null,
  onChange = () => {},
  isDisabled = false,
  placeholder = 'Select Time',
  name = null,
  cancelButtonText = 'Cancel',
  saveButtonText = 'Save',
  onFocus = () => {},
  onSave = () => {},
  onCancel = () => {},
  use12Hours = true, // Default to 12-hour format
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  const [activeColumn, setActiveColumn] = useState(0); // 0=hour, 1=minute, 2=period
  const [hourActiveIndex, setHourActiveIndex] = useState(null);
  const [minuteActiveIndex, setMinuteActiveIndex] = useState(null);
  const [periodActiveIndex, setPeriodActiveIndex] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Generate options based on format
  const hours = use12Hours
    ? Array.from({ length: 12 }, (_, i) => i + 1) // 1-12 for 12-hour
    : Array.from({ length: 24 }, (_, i) => i); // 0-23 for 24-hour
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0-59
  const periods = ['AM', 'PM'];

  const hourListRef = useRef([]);
  const minuteListRef = useRef([]);
  const periodListRef = useRef([]);

  // Convert 24-hour to 12-hour format
  const convertTo12Hour = (hour24) => {
    if (hour24 === 0) return { hour: 12, period: 'AM' }; // 00:xx = 12:xx AM
    if (hour24 < 12) return { hour: hour24, period: 'AM' }; // 01-11:xx = 1-11:xx AM
    if (hour24 === 12) return { hour: 12, period: 'PM' }; // 12:xx = 12:xx PM
    return { hour: hour24 - 12, period: 'PM' }; // 13-23:xx = 1-11:xx PM
  };

  // Convert 12-hour to 24-hour format
  const convertTo24Hour = (hour12, period) => {
    if (period === 'AM') {
      return hour12 === 12 ? 0 : hour12;
    } else {
      return hour12 === 12 ? 12 : hour12 + 12;
    }
  };

  // Parse time value and sync with floating UI
  const parseAndSyncTimeValue = (timeValue) => {
    if (!timeValue) return;

    // TimeInput always gives us 24-hour format: "22:30" or "10:30"
    const timeRegex = /^(\d{1,2}):(\d{2})$/;
    const match = timeValue.match(timeRegex);

    console.log('qswap1.5 parsing 24h format:', timeValue, match);

    if (match) {
      const hour24 = parseInt(match[1]);
      const minute = parseInt(match[2]);

      // Convert 24-hour to 12-hour for internal storage
      const converted = convertTo12Hour(hour24);
      const hour12 = converted.hour;
      const period = converted.period;

      // Always store the 12-hour values and period internally
      setSelectedHour(hour12);
      setSelectedMinute(minute);
      setSelectedPeriod(period);
      console.log('qswap2 converted to 12h:', hour12, minute, period);

      // Set dropdown active indices based on display mode
      if (use12Hours) {
        // 12-hour dropdown: use 12-hour values (1-12)
        setHourActiveIndex(hours.indexOf(hour12));
        setMinuteActiveIndex(minutes.indexOf(minute));
        setPeriodActiveIndex(periods.indexOf(period));
      } else {
        // 24-hour dropdown: use 24-hour values (0-23)
        setHourActiveIndex(hours.indexOf(hour24));
        setMinuteActiveIndex(minutes.indexOf(minute));
        // No period selection in 24-hour dropdown
      }
    } else {
      console.log('qswap1.8 invalid 24h time format:', timeValue);
    }
  };

  // Parse initial value
  useEffect(() => {
    parseAndSyncTimeValue(initialValue);
  }, [initialValue, hours, periods]);

  // Auto-scroll to selected items when dropdown opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        // Scroll hour column to selected hour
        if (hourActiveIndex !== null && hourListRef.current[hourActiveIndex]) {
          hourListRef.current[hourActiveIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }

        // Scroll minute column to selected minute
        if (minuteActiveIndex !== null && minuteListRef.current[minuteActiveIndex]) {
          minuteListRef.current[minuteActiveIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }

        // Scroll period column to selected period (if in 12-hour mode)
        if (use12Hours && periodActiveIndex !== null && periodListRef.current[periodActiveIndex]) {
          periodListRef.current[periodActiveIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);
    }
  }, [isOpen, hourActiveIndex, minuteActiveIndex, periodActiveIndex, use12Hours]);

  // Scroll event handlers to update selection based on middle position (iOS behavior)
  const handleScrollToCenter = (scrollContainer, listRef, items, onUpdate) => {
    if (!scrollContainer || !listRef.current.length) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    items.forEach((_, index) => {
      const item = listRef.current[index];
      if (item) {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const distance = Math.abs(containerCenter - itemCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    onUpdate(closestIndex);
  };

  // Handle focus when active column changes
  useEffect(() => {
    if (isOpen) {
      // console.log('qswap2 hourActiveIndex', activeColumn, hourActiveIndex, selectedHour);
      // console.log('qswap3 minuteActiveIndex', activeColumn, minuteActiveIndex, selectedMinute);
      // console.log('qswap4 periodActiveIndex', activeColumn, periodActiveIndex, selectedPeriod);

      // Set initial active index for the active column
      if (activeColumn === 0 && hourActiveIndex === null) {
        const selectedIndex = hours.findIndex((h) => h === selectedHour);
        setHourActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      } else if (activeColumn === 1 && minuteActiveIndex === null) {
        const selectedIndex = minutes.findIndex((m) => m === selectedMinute);
        setMinuteActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      } else if (activeColumn === 2 && periodActiveIndex === null) {
        const selectedIndex = periods.findIndex((p) => p === selectedPeriod);
        setPeriodActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
    }
  }, [
    activeColumn,
    isOpen,
    hours,
    minutes,
    periods,
    selectedHour,
    selectedMinute,
    selectedPeriod,
    hourActiveIndex,
    minuteActiveIndex,
    periodActiveIndex,
  ]);

  // Floating UI setup
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    middleware: [
      offset(8), // 8px below input
    ],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'dialog' });

  // All navigation hooks use the main context
  const hourNavigation = useListNavigation(context, {
    listRef: hourListRef,
    activeIndex: hourActiveIndex,
    onNavigate: (index) => {
      console.log('🔍 Hour navigation called:', index);
      setHourActiveIndex(index);
    },
    virtual: isInputFocused ? true : false,
    loop: true,
    scrollItemIntoView: true, // Disable built-in, use manual
    focusItemOnOpen: 'auto',
    // Removed orientation: 'horizontal' and focusItemOnHover: true
  });

  const minuteNavigation = useListNavigation(context, {
    listRef: minuteListRef,
    activeIndex: minuteActiveIndex,
    onNavigate: (index) => {
      console.log('🔍 Minute navigation called:', index);
      setMinuteActiveIndex(index);
    },
    virtual: isInputFocused ? true : false,
    loop: true,
    scrollItemIntoView: true, // Disable built-in, use manual
    focusItemOnOpen: 'auto',
  });

  const periodNavigation = useListNavigation(context, {
    listRef: periodListRef,
    activeIndex: periodActiveIndex,
    onNavigate: (index) => {
      console.log('🔍 Period navigation called:', index);
      setPeriodActiveIndex(index);
    },
    virtual: isInputFocused ? true : false,
    loop: true,
    scrollItemIntoView: true, // Disable built-in, use manual
    focusItemOnOpen: 'auto',
  });

  // Get interaction props for each column
  const { getItemProps: getHourItemProps } = useInteractions([hourNavigation]);
  const { getItemProps: getMinuteItemProps } = useInteractions([minuteNavigation]);
  const { getItemProps: getPeriodItemProps } = useInteractions([periodNavigation]);

  // Include the active column's navigation in the main interactions
  const activeNavigation = !isInputFocused
    ? activeColumn === 0
      ? hourNavigation
      : activeColumn === 1
      ? minuteNavigation
      : use12Hours
      ? periodNavigation
      : [] // Fallback for 24-hour mode
    : [];

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
    activeNavigation, // Include navigation when dropdown focused
  ]);

  // Format display value - ALWAYS returns 24-hour format for TimeInput
  const formatTimeValue = () => {
    if (selectedHour === null || selectedHour === undefined) return '';

    // Convert internal 12-hour to 24-hour format for TimeInput
    const hour24 = convertTo24Hour(selectedHour, selectedPeriod);
    const hour = String(hour24).padStart(2, '0');
    const minute = String(selectedMinute).padStart(2, '0');
    console.log('Qswap TimePicker format (always 24h for TimeInput)', `${hour}:${minute}`);
    return `${hour}:${minute}`;
  };

  // Handle selection for each column and sync to TimeInput
  const handleHourSelect = (index) => {
    const dropdownHour = hours[index]; // This is 1-12 for 12h mode, 0-23 for 24h mode
    setHourActiveIndex(null);

    if (use12Hours) {
      // 12-hour dropdown: selected hour is 1-12, keep current period
      setSelectedHour(dropdownHour);
      // Period stays the same
    } else {
      // 24-hour dropdown: selected hour is 0-23, convert to 12h for internal storage
      const converted = convertTo12Hour(dropdownHour);
      setSelectedHour(dropdownHour);
      setSelectedPeriod(converted.period);
    }

    // formatTimeValue() will convert to 24h format for TimeInput
    setTimeout(() => {
      const newTimeValue = formatTimeValue();
      onChange(newTimeValue);
    }, 0);
  };

  const handleMinuteSelect = (index) => {
    const newMinute = minutes[index];
    setSelectedMinute(newMinute);
    setMinuteActiveIndex(null);

    // Use formatTimeValue to ensure proper format for TimeInput
    setTimeout(() => {
      const newTimeValue = formatTimeValue();
      onChange(newTimeValue);
    }, 0);
  };

  const handlePeriodSelect = (index) => {
    const newPeriod = periods[index];
    setSelectedPeriod(newPeriod);
    setPeriodActiveIndex(null);

    // Use formatTimeValue to ensure proper format for TimeInput
    setTimeout(() => {
      const newTimeValue = formatTimeValue();
      onChange(newTimeValue);
    }, 0);
  };

  const handleSave = () => {
    const timeValue = formatTimeValue(); // Returns 24h format for TimeInput
    onChange(timeValue);
    onSave(timeValue);
    setIsOpen(false);
    setIsInputFocused(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
    setIsInputFocused(false);
  };

  const handleKeyDown = (event) => {
    // console.log('🔍 HandleKeyDown called with:', event.key, 'Active column:', activeColumn);

    if (event.key === 'ArrowLeft' || (event.key === 'Tab' && event.shiftKey)) {
      event.preventDefault();
      const newColumn = Math.max(0, activeColumn - 1);
      console.log('🔍 Switching to column:', newColumn);
      setActiveColumn(newColumn);

      // Set active index for the new column
      if (newColumn === 0) {
        setHourActiveIndex(selectedHour ? hours.indexOf(selectedHour) : 0);
        setMinuteActiveIndex(null);
        setPeriodActiveIndex(null);
      } else if (newColumn === 1) {
        setHourActiveIndex(null);
        setMinuteActiveIndex(selectedMinute ?? 0);
        setPeriodActiveIndex(null);
      } else if (newColumn === 2) {
        setHourActiveIndex(null);
        setMinuteActiveIndex(null);
        setPeriodActiveIndex(selectedPeriod ? periods.indexOf(selectedPeriod) : 0);
      }
    } else if (event.key === 'ArrowRight' || event.key === 'Tab') {
      event.preventDefault();
      const maxColumn = use12Hours ? 2 : 1; // 3 columns for 12-hour (0,1,2), 2 columns for 24-hour (0,1)
      const newColumn = Math.min(maxColumn, activeColumn + 1);
      console.log('🔍 Switching to column:', newColumn);
      setActiveColumn(newColumn);

      // Set active index for the new column
      if (newColumn === 0) {
        setHourActiveIndex(selectedHour ? hours.indexOf(selectedHour) : 0);
        setMinuteActiveIndex(null);
        setPeriodActiveIndex(null);
      } else if (newColumn === 1) {
        setHourActiveIndex(null);
        setMinuteActiveIndex(selectedMinute ?? 0);
        setPeriodActiveIndex(null);
      } else if (newColumn === 2) {
        setHourActiveIndex(null);
        setMinuteActiveIndex(null);
        setPeriodActiveIndex(selectedPeriod ? periods.indexOf(selectedPeriod) : 0);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeColumn === 0 && hourActiveIndex !== null) {
        handleHourSelect(hourActiveIndex);
      } else if (activeColumn === 1 && minuteActiveIndex !== null) {
        handleMinuteSelect(minuteActiveIndex);
      } else if (activeColumn === 2 && periodActiveIndex !== null) {
        handlePeriodSelect(periodActiveIndex);
      }
    }
    // Let ArrowUp/ArrowDown pass through to the active navigation hook
  };

  return (
    <Box>
      <TimeInput
        ref={refs.setReference}
        name={name}
        value={formatTimeValue()}
        icon={<ClockIcon size="medium" />}
        label={label}
        placeholder={placeholder}
        disabled={isDisabled}
        withSeconds={false}
        {...getReferenceProps({
          onFocus,
          onClick: () => {
            setIsInputFocused(true);
            setIsOpen(true);
            setActiveColumn(0);
          },
        })}
        onChange={(event) => {
          const timeValue = event.target.value;
          console.log('qswap1 TimeInput onChange (24h format):', timeValue);
          parseAndSyncTimeValue(timeValue);
          onChange(timeValue); // Call parent onChange with 24h format
        }}
      />

      {isOpen && (
        <FloatingPortal>
          <BaseBox
            ref={refs.setFloating}
            style={floatingStyles}
            backgroundColor="surface.background.gray.moderate"
            boxShadow="0 11px 15px #0005"
            borderRadius="medium"
            overflow="hidden"
            width="320px"
            zIndex={1000}
            {...getFloatingProps({
              onKeyDown: handleKeyDown,
            })}
            onClick={() => setIsInputFocused(false)}
          >
            {/* 3-Column Layout - iOS Style */}
            <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
              <BaseBox display="flex" height="200px" position="relative">
                {/* Hour Column */}
                <BaseBox
                  flex="1"
                  borderRight="thin"
                  borderColor="surface.border.gray.muted"
                  position="relative"
                  backgroundColor={
                    activeColumn === 0 ? 'surface.background.sea.muted' : 'transparent'
                  }
                  onClick={() => setActiveColumn(0)}
                >
                  {/* Selection overlay - visual indicator for middle item */}
                  <BaseBox
                    position="absolute"
                    top="50%"
                    left="0"
                    right="0"
                    height="40px"
                    transform="translateY(-50%)"
                    backgroundColor="surface.background.cloud.intense"
                    borderRadius="medium"
                    zIndex={1}
                    pointerEvents="none"
                    borderTop="1px solid"
                    borderBottom="1px solid"
                    borderColor="surface.border.gray.muted"
                  />

                  {/* Scrollable container */}
                  <BaseBox
                    height="100%"
                    overflowY="auto"
                    paddingY="80px" // Add padding to center items
                    role="listbox"
                    aria-label="Select hour"
                    css={{
                      scrollSnapType: 'y mandatory',
                      scrollBehavior: 'smooth',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                      scrollbarWidth: 'none',
                    }}
                    onScroll={(e) => {
                      // Update selection based on center position on scroll end
                      clearTimeout(window.hourScrollTimeout);
                      window.hourScrollTimeout = setTimeout(() => {
                        handleScrollToCenter(e.target, hourListRef, hours, (index) => {
                          setHourActiveIndex(index);
                          if (use12Hours) {
                            setSelectedHour(hours[index]);
                          } else {
                            const converted = convertTo12Hour(hours[index]);
                            setSelectedHour(converted.hour);
                            setSelectedPeriod(converted.period);
                          }
                        });
                      }, 150);
                    }}
                  >
                    {hours.map((hour, index) => {
                      const isSelected = hour === selectedHour;
                      const isActive = activeColumn === 0 && hourActiveIndex === index;
                      // console.log('qswap5 imp', activeColumn, selectedHour, hourActiveIndex);
                      return (
                        <BaseBox
                          key={hour}
                          ref={(node) => {
                            hourListRef.current[index] = node;
                          }}
                          role="option"
                          aria-selected={isSelected}
                          tabIndex={activeColumn === 0 ? (isActive ? 0 : -1) : -1}
                          height="40px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          cursor="pointer"
                          position="relative"
                          zIndex={2}
                          css={{
                            scrollSnapAlign: 'center',
                            scrollSnapStop: 'always',
                          }}
                          {...getHourItemProps({
                            onClick: () => handleHourSelect(index),
                          })}
                        >
                          <Text
                            weight={isSelected ? 'semibold' : 'regular'}
                            color={
                              isActive || isSelected ? 'surface.text.primary' : 'surface.text.muted'
                            }
                            css={{
                              transform: isSelected
                                ? 'scale(1.3)'
                                : isActive
                                ? 'scale(1.2)'
                                : 'scale(1)',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {String(hour).padStart(2, '0')}
                          </Text>
                        </BaseBox>
                      );
                    })}
                  </BaseBox>
                </BaseBox>

                {/* Minute Column */}
                <BaseBox
                  flex="1"
                  borderRight="thin"
                  borderColor="surface.border.gray.muted"
                  position="relative"
                  backgroundColor={
                    activeColumn === 1 ? 'surface.background.sea.muted' : 'transparent'
                  }
                  onClick={() => setActiveColumn(1)}
                >
                  {/* Selection overlay - visual indicator for middle item */}
                  <BaseBox
                    position="absolute"
                    top="50%"
                    left="0"
                    right="0"
                    height="40px"
                    transform="translateY(-50%)"
                    backgroundColor="surface.background.cloud.intense"
                    borderRadius="medium"
                    zIndex={1}
                    pointerEvents="none"
                    borderTop="1px solid"
                    borderBottom="1px solid"
                    borderColor="surface.border.gray.muted"
                  />

                  {/* Scrollable container */}
                  <BaseBox
                    height="100%"
                    overflowY="auto"
                    paddingY="80px" // Add padding to center items
                    role="listbox"
                    aria-label="Select minute"
                    css={{
                      scrollSnapType: 'y mandatory',
                      scrollBehavior: 'smooth',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                      scrollbarWidth: 'none',
                    }}
                    onScroll={(e) => {
                      // Update selection based on center position on scroll end
                      clearTimeout(window.minuteScrollTimeout);
                      window.minuteScrollTimeout = setTimeout(() => {
                        handleScrollToCenter(e.target, minuteListRef, minutes, (index) => {
                          setMinuteActiveIndex(index);
                          setSelectedMinute(minutes[index]);
                        });
                      }, 150);
                    }}
                  >
                    {minutes.map((minute, index) => {
                      const isSelected = minute === selectedMinute;
                      const isActive = activeColumn === 1 && minuteActiveIndex === index;

                      return (
                        <BaseBox
                          key={minute}
                          ref={(node) => {
                            minuteListRef.current[index] = node;
                          }}
                          role="option"
                          aria-selected={isSelected}
                          tabIndex={activeColumn === 1 ? (isActive ? 0 : -1) : -1}
                          height="40px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          cursor="pointer"
                          position="relative"
                          zIndex={2}
                          css={{
                            scrollSnapAlign: 'center',
                            scrollSnapStop: 'always',
                          }}
                          {...getMinuteItemProps({
                            onClick: () => handleMinuteSelect(index),
                          })}
                        >
                          <Text
                            weight={isSelected ? 'semibold' : 'regular'}
                            color={
                              isActive || isSelected ? 'surface.text.primary' : 'surface.text.muted'
                            }
                            css={{
                              transform: isSelected
                                ? 'scale(1.3)'
                                : isActive
                                ? 'scale(1.2)'
                                : 'scale(1)',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {String(minute).padStart(2, '0')}
                          </Text>
                        </BaseBox>
                      );
                    })}
                  </BaseBox>
                </BaseBox>

                {/* AM/PM Column - Only show in 12-hour mode */}
                {use12Hours && (
                  <BaseBox
                    flex="0 0 80px"
                    position="relative"
                    backgroundColor={
                      activeColumn === 2 ? 'surface.background.sea.muted' : 'transparent'
                    }
                    onClick={() => setActiveColumn(2)}
                  >
                    {/* Selection overlay - visual indicator for middle item */}
                    <BaseBox
                      position="absolute"
                      top="50%"
                      left="0"
                      right="0"
                      height="40px"
                      transform="translateY(-50%)"
                      backgroundColor="surface.background.cloud.intense"
                      borderRadius="medium"
                      zIndex={1}
                      pointerEvents="none"
                      borderTop="1px solid"
                      borderBottom="1px solid"
                      borderColor="surface.border.gray.muted"
                    />

                    {/* Scrollable container */}
                    <BaseBox
                      height="100%"
                      overflowY="auto"
                      paddingY="80px" // Add padding to center items
                      role="listbox"
                      aria-label="Select AM or PM"
                      css={{
                        scrollSnapType: 'y mandatory',
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                        scrollbarWidth: 'none',
                      }}
                      onScroll={(e) => {
                        // Update selection based on center position on scroll end
                        clearTimeout(window.periodScrollTimeout);
                        window.periodScrollTimeout = setTimeout(() => {
                          handleScrollToCenter(e.target, periodListRef, periods, (index) => {
                            setPeriodActiveIndex(index);
                            setSelectedPeriod(periods[index]);
                          });
                        }, 150);
                      }}
                    >
                      {periods.map((period, index) => {
                        const isSelected = period === selectedPeriod;
                        const isActive = activeColumn === 2 && periodActiveIndex === index;

                        return (
                          <BaseBox
                            key={period}
                            ref={(node) => {
                              periodListRef.current[index] = node;
                            }}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={activeColumn === 2 ? (isActive ? 0 : -1) : -1}
                            height="40px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            position="relative"
                            zIndex={2}
                            css={{
                              scrollSnapAlign: 'center',
                              scrollSnapStop: 'always',
                            }}
                            {...getPeriodItemProps({
                              onClick: () => handlePeriodSelect(index),
                            })}
                          >
                            <Text
                              weight={isSelected ? 'semibold' : 'regular'}
                              color={
                                isActive || isSelected
                                  ? 'surface.text.primary'
                                  : 'surface.text.muted'
                              }
                              css={{
                                transform: isSelected
                                  ? 'scale(1.3)'
                                  : isActive
                                  ? 'scale(1.2)'
                                  : 'scale(1)',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {period}
                            </Text>
                          </BaseBox>
                        );
                      })}
                    </BaseBox>
                  </BaseBox>
                )}
              </BaseBox>
            </FloatingFocusManager>

            {/* Action Buttons */}
            <Box
              padding="spacing.3"
              display="flex"
              justifyContent="space-between"
              borderTop="thin"
              borderColor="surface.border.gray.muted"
            >
              <Button variant="tertiary" onClick={handleCancel}>
                {cancelButtonText}
              </Button>
              <Button onClick={handleSave}>{saveButtonText}</Button>
            </Box>
          </BaseBox>
        </FloatingPortal>
      )}
    </Box>
  );
}

export { TimePicker };
