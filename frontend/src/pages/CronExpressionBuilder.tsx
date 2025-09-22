import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Clock, Copy, X, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { parseNaturalLanguageCron } from '../services/cronApi';

type TimeUnit = 'minute' | 'hour' | 'day' | 'month' | 'weekday';
type Preset = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

const timeUnits: TimeUnit[] = ['minute', 'hour', 'day', 'month', 'weekday'];
const presets: Preset[] = ['hourly', 'daily', 'weekly', 'monthly', 'yearly', 'custom'];

const presetExpressions: Record<Preset, string> = {
  hourly: '0 * * * *',
  daily: '0 0 * * *',
  weekly: '0 0 * * 0',
  monthly: '0 0 1 * *',
  yearly: '0 0 1 1 *',
  custom: '* * * * *',
};

const timeUnitOptions: Record<TimeUnit, string[]> = {
  minute: Array.from({ length: 60 }, (_, i) => i.toString()),
  hour: Array.from({ length: 24 }, (_, i) => i.toString()),
  day: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
  month: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  weekday: ['0', '1', '2', '3', '4', '5', '6'],
};

const timeUnitLabels: Record<TimeUnit, string> = {
  minute: 'Minute',
  hour: 'Hour',
  day: 'Day of Month',
  month: 'Month',
  weekday: 'Day of Week',
};

export default function CronExpressionBuilder() {
  const [activePreset, setActivePreset] = useState<Preset>('daily');
  const [customExpression, setCustomExpression] = useState('0 0 * * *');
  const [selectedValues, setSelectedValues] = useState<Record<TimeUnit, string[]>>({
    minute: ['0'],
    hour: ['0'],
    day: ['*'],
    month: ['*'],
    weekday: ['*'],
  });
  const [isValid, setIsValid] = useState(true);
  const [openPopovers, setOpenPopovers] = useState<Record<TimeUnit, boolean>>({
    minute: false,
    hour: false,
    day: false,
    month: false,
    weekday: false,
  });
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nextRunTimes, setNextRunTimes] = useState<string[]>([]);

  // Initialize with daily preset
  useEffect(() => {
    handlePresetChange('daily');
  }, []);

  const handlePresetChange = (preset: Preset) => {
    setActivePreset(preset);
    if (preset !== 'custom') {
      setCustomExpression(presetExpressions[preset]);
      parseExpression(presetExpressions[preset]);
    }
  };

  const parseExpression = (expression: string) => {
    const parts = expression.split(' ');
    if (parts.length !== 5) {
      setIsValid(false);
      return;
    }

    try {
      const newValues = {
        minute: parsePart(parts[0], 'minute'),
        hour: parsePart(parts[1], 'hour'),
        day: parsePart(parts[2], 'day'),
        month: parsePart(parts[3], 'month'),
        weekday: parsePart(parts[4], 'weekday'),
      };
      setSelectedValues(newValues);
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
    }
  };

  const parsePart = (part: string, _unit: TimeUnit): string[] => {
    if (part === '*') return ['*'];
    if (part.includes(',')) return part.split(',');
    if (part.includes('-')) {
      const [start, end] = part.split('-');
      const range = [];
      const startNum = parseInt(start);
      const endNum = parseInt(end);
      for (let i = startNum; i <= endNum; i++) {
        range.push(i.toString());
      }
      return range;
    }
    if (part.includes('/')) {
      const [value, step] = part.split('/');
      if (value === '*') {
        return [`*/${step}`];
      }
    }
    return [part];
  };

  const buildExpression = (values: Record<TimeUnit, string[]>): string => {
    return [
      values.minute.join(','),
      values.hour.join(','),
      values.day.join(','),
      values.month.join(','),
      values.weekday.join(','),
    ].join(' ');
  };

  const handleValueChange = (unit: TimeUnit, values: string[]) => {
    const newValues = { ...selectedValues, [unit]: values };
    setSelectedValues(newValues);

    if (activePreset === 'custom') {
      const expression = buildExpression(newValues);
      setCustomExpression(expression);
      validateExpression(expression);
    } else {
      setActivePreset('custom');
    }
  };

  const validateExpression = (expression: string) => {
    try {
      // Simple validation - could be enhanced with a proper cron parser library
      const parts = expression.split(' ');
      if (parts.length !== 5) {
        setIsValid(false);
        return false;
      }

      // Check each part contains valid characters
      const validChars = /^[\d,*\/-]+$/;
      for (let i = 0; i < 5; i++) {
        if (!validChars.test(parts[i])) {
          // Fixed: Added missing closing parenthesis
          setIsValid(false);
          return false;
        }
      }

      setIsValid(true);
      return true;
    } catch (e) {
      setIsValid(false);
      return false;
    }
  };

  const handleCustomExpressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const expression = e.target.value;
    setCustomExpression(expression);
    parseExpression(expression);
    setActivePreset('custom');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customExpression);
    toast.success('Copied to clipboard!');
  };

  const handleNaturalLanguageAnalysis = async () => {
    if (!naturalLanguageInput.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await parseNaturalLanguageCron({ 
        description: naturalLanguageInput 
      });
      
      // Update the expression and UI
      setCustomExpression(result.cronExpression);
      parseExpression(result.cronExpression);
      setActivePreset('custom');
      setNextRunTimes(result.nextRunTimes);
      
      toast.success('Successfully parsed your description!');
    } catch (error) {
      console.error('Error parsing natural language:', error);
      toast.error('Failed to parse your description. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePopover = (unit: TimeUnit, open: boolean) => {
    setOpenPopovers({ ...openPopovers, [unit]: open });
  };

  const toggleValue = (unit: TimeUnit, value: string) => {
    const currentValues = [...selectedValues[unit]];
    if (value === '*') {
      handleValueChange(unit, ['*']);
    } else if (currentValues.includes('*')) {
      handleValueChange(unit, [value]);
    } else if (currentValues.includes(value)) {
      if (currentValues.length === 1) {
        handleValueChange(unit, ['*']);
      } else {
        handleValueChange(
          unit,
          currentValues.filter(v => v !== value)
        );
      }
    } else {
      handleValueChange(unit, [...currentValues, value]);
    }
  };

  const formatDisplayValue = (unit: TimeUnit) => {
    const values = selectedValues[unit];
    if (values.includes('*')) return 'Every';
    if (values.length > 3) return `${values.length} selected`;
    return values.join(', ');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Clock className="h-8 w-8 text-primary" />
          Cron Expression Builder
        </h1>
        <p className="text-muted-foreground">
          Visually build and validate cron expressions for scheduling tasks
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        {/* Natural Language Input Section */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-blue-900 dark:text-blue-100">Natural Language Input</h3>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Describe when you want your task to run in plain English (e.g., "every day at 9 AM", "every Monday at 2 PM", "every 15 minutes")
          </p>
          <div className="space-y-3">
            <Textarea
              placeholder="Type your schedule description here... (e.g., 'Run every weekday at 9:30 AM')"
              value={naturalLanguageInput}
              onChange={(e) => setNaturalLanguageInput(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleNaturalLanguageAnalysis}
                disabled={isAnalyzing || !naturalLanguageInput.trim()}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isAnalyzing ? 'Analyzing...' : 'Generate Cron Expression'}
              </Button>
              {naturalLanguageInput && (
                <Button 
                  variant="outline" 
                  onClick={() => setNaturalLanguageInput('')}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs value={activePreset} onValueChange={val => handlePresetChange(val as Preset)}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            {presets.map(preset => (
              <TabsTrigger key={preset} value={preset}>
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visual Builder */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Visual Builder</h2>

            {timeUnits.map(unit => (
              <div key={unit} className="space-y-2">
                <Label>{timeUnitLabels[unit]}</Label>
                <Popover open={openPopovers[unit]} onOpenChange={open => togglePopover(unit, open)}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      <span>{formatDisplayValue(unit)}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandGroup className="max-h-[300px] overflow-y-auto">
                        <CommandItem
                          value="*"
                          onSelect={() => toggleValue(unit, '*')}
                          className="flex items-center"
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4 flex-shrink-0',
                              selectedValues[unit].includes('*') ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <span className="truncate">Every</span>
                        </CommandItem>
                        {timeUnitOptions[unit].map(value => (
                          <CommandItem
                            key={value}
                            value={value}
                            onSelect={() => toggleValue(unit, value)}
                            className="flex items-center"
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4 flex-shrink-0',
                                selectedValues[unit].includes(value) ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            <span className="truncate">{value}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            ))}

            <div className="pt-4">
              <Label>Advanced Options</Label>
              <div className="text-sm text-muted-foreground mt-1">
                Use ranges (1-5), steps (*/5), and lists (1,3,5) in the custom expression field
              </div>
            </div>
          </div>

          {/* Expression Preview */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Cron Expression</h2>

            <div className="space-y-2">
              <Label>Generated Expression</Label>
              <div className="flex gap-2">
                <Input
                  value={customExpression}
                  onChange={handleCustomExpressionChange}
                  className="font-mono"
                />
                <Button variant="outline" size="icon" onClick={handleCopy} disabled={!isValid}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${isValid ? 'bg-green-500' : 'bg-red-500'}`}
              >
                {isValid ? (
                  <Check className="h-3 w-3 text-white" />
                ) : (
                  <X className="h-3 w-3 text-white" />
                )}
              </div>
              <span
                className={
                  isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }
              >
                {isValid ? 'Valid cron expression' : 'Invalid cron expression'}
              </span>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Expression Breakdown</h3>
              <div className="grid grid-cols-5 gap-2 text-center">
                {timeUnits.map((unit, index) => (
                  <div key={unit} className="space-y-1">
                    <div className="text-xs font-medium">{timeUnitLabels[unit]}</div>
                    <Badge variant="outline" className="font-mono w-full">
                      {customExpression.split(' ')[index] || '?'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium mb-2">Next Run Times</h3>
              <div className="text-sm text-muted-foreground">
                {isValid ? (
                  nextRunTimes.length > 0 ? (
                    <div className="space-y-1">
                      {nextRunTimes.map((time, index) => (
                        <div key={index}>
                          {index === 0 ? 'Next: ' : index === 1 ? 'Then: ' : 'After: '}{time}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div>Next: {new Date(Date.now() + 3600000).toLocaleString()}</div>
                      <div>Then: {new Date(Date.now() + 7200000).toLocaleString()}</div>
                      <div>After: {new Date(Date.now() + 10800000).toLocaleString()}</div>
                    </div>
                  )
                ) : (
                  'Enter a valid cron expression to see run times'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Note: For production use, consider validating with a cron parser library</p>
      </div>
    </div>
  );
}
