import React from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from './ui/Text';
import { Card, CardHeader, CardContent } from './ui/Card';
import {
  VictoryBar,
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryPie,
  VictoryTheme,
  VictoryLabel,
  VictoryTooltip,
} from 'victory-native';
import { format, parseISO } from 'date-fns';

type ChartType = 'line' | 'bar' | 'pie';
type ChartData = Array<{ [key: string]: any }>;

interface AnalyticsChartProps {
  title: string;
  data: ChartData;
  type?: ChartType;
  xKey: string;
  yKey: string;
  colorScale?: string[];
  height?: number;
  formatX?: (value: any) => string;
  formatY?: (value: any) => string;
  loading?: boolean;
}

export const AnalyticsChart = ({
  title,
  data,
  type = 'line',
  xKey,
  yKey,
  colorScale = ['#11CBD7', '#C6F1E7', '#FA4659', '#F0FFF3'],
  height = 250,
  formatX,
  formatY,
  loading = false,
}: AnalyticsChartProps) => {
  const screenWidth = Dimensions.get('window').width - 48; // Full width minus padding

  const defaultFormatX = (value: any) => {
    if (typeof value === 'string' && value.includes('-')) {
      try {
        return format(parseISO(value), 'MMM dd');
      } catch (e) {
        return value;
      }
    }
    return String(value);
  };

  const defaultFormatY = (value: any) => {
    return typeof value === 'number' ? value.toLocaleString() : String(value);
  };

  const formatXValue = formatX || defaultFormatX;
  const formatYValue = formatY || defaultFormatY;

  const renderChart = () => {
    if (loading || !data || data.length === 0) {
      return (
        <View className="h-40 items-center justify-center">
          <Text className="text-gray-500">No data available</Text>
        </View>
      );
    }

    switch (type) {
      case 'bar':
        return (
          <VictoryChart
            width={screenWidth}
            height={height}
            domainPadding={{ x: 20 }}
            padding={{ top: 20, bottom: 50, left: 50, right: 30 }}
            theme={VictoryTheme.material}
          >
            <VictoryAxis
              tickFormat={formatXValue}
              style={{
                axis: { stroke: '#E5E7EB' },
                tickLabels: { 
                  fontSize: 10, 
                  padding: 5,
                  angle: data.length > 5 ? -45 : 0,
                  textAnchor: data.length > 5 ? 'end' : 'middle',
                }
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={formatYValue}
              style={{
                axis: { stroke: '#E5E7EB' },
                tickLabels: { fontSize: 10, padding: 5 }
              }}
            />
            <VictoryBar
              data={data}
              x={xKey}
              y={yKey}
              style={{
                data: { fill: '#11CBD7' },
              }}
              labels={({ datum }) => formatYValue(datum[yKey])}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{
                    stroke: '#E5E7EB',
                    fill: 'white',
                  }}
                />
              }
            />
          </VictoryChart>
        );

      case 'pie':
        return (
          <VictoryPie
            width={screenWidth}
            height={height}
            data={data}
            x={xKey}
            y={yKey}
            colorScale={colorScale}
            innerRadius={70}
            labelRadius={90}
            style={{
              labels: { fontSize: 10, fill: '#4B5563' }
            }}
            labelComponent={
              <VictoryLabel
                style={{ fontSize: 10, fill: '#4B5563' }}
                text={({ datum }) => 
                  `${datum[xKey]}: ${formatYValue(datum[yKey])}`
                }
              />
            }
          />
        );

      case 'line':
      default:
        return (
          <VictoryChart
            width={screenWidth}
            height={height}
            padding={{ top: 20, bottom: 50, left: 50, right: 30 }}
            theme={VictoryTheme.material}
          >
            <VictoryAxis
              tickFormat={formatXValue}
              style={{
                axis: { stroke: '#E5E7EB' },
                tickLabels: { 
                  fontSize: 10, 
                  padding: 5,
                  angle: data.length > 5 ? -45 : 0,
                  textAnchor: data.length > 5 ? 'end' : 'middle',
                }
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={formatYValue}
              style={{
                axis: { stroke: '#E5E7EB' },
                tickLabels: { fontSize: 10, padding: 5 }
              }}
            />
            <VictoryLine
              data={data}
              x={xKey}
              y={yKey}
              style={{
                data: { stroke: '#11CBD7', strokeWidth: 2 },
              }}
            />
          </VictoryChart>
        );
    }
  };

  return (
    <Card className="mb-5">
      <CardHeader>
        <Text variant="h6" weight="semibold">
          {title}
        </Text>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};