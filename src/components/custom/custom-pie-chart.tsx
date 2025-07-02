import * as React from 'react'
import { Label, Pie, PieChart } from 'recharts'
import { Button } from '@/components/custom/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { IconRepeat } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export type BasicChartDataType = {
  key: string
  value: number
  fill: string
}

export type PieChartDataType = BasicChartDataType & {
  percentage?: number
}

interface CustomPieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: PieChartDataType[]
  title: string
  tooltipHideLabel?: boolean
  isPercentage?: boolean
}

export const CustomPieChart: React.FC<CustomPieChartProps> = ({
  data,
  title,
  tooltipHideLabel = true,
  isPercentage = false,
  className,
}) => {
  const totalValues = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [data])

  const dataWithPercentage = React.useMemo(() => {
    if (isPercentage)
      return data.map((item) => ({
        ...item,
        percentage: (item.value / totalValues) * 100,
      }))
    return data
  }, [isPercentage, data, totalValues])

  const createDynamicChartConfig = (data: PieChartDataType[]) => {
    const chartConfig: Record<string, { label: string; color?: string }> = {
      value: {
        label: isPercentage ? 'percentage' : 'value',
      },
    }

    data.forEach((item) => {
      chartConfig[item.key] = {
        label: item.key,
        color: item.fill,
      }
    })

    return chartConfig
  }

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className='items-center p-6 pb-0 pr-4 pt-2'>
        <CardTitle className='flex w-full flex-row items-center justify-between'>
          <div>{title}</div>
          <div>
            <Button variant={'ghost'} className='px-1.5 py-1'>
              <IconRepeat size={22} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex h-full flex-row items-center gap-8 px-8 pb-3'>
        <ChartContainer
          className='mx-auto aspect-square h-[200px]'
          config={createDynamicChartConfig(data)}
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel={tooltipHideLabel}
                  isPercentage={isPercentage}
                />
              }
            />
            <Pie
              data={dataWithPercentage}
              dataKey={isPercentage ? 'percentage' : 'value'}
              nameKey={'key'}
              innerRadius={50}
              outerRadius={80}
              strokeWidth={5}
              cornerRadius={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalValues.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Usings
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className='flex flex-col gap-1.5 p-2'>
          {data.map((data, index) => (
            <div key={index} className='flex flex-row items-center gap-2'>
              <div
                className='h-2 rounded-full'
                style={{ backgroundColor: data.fill, width: '10px' }}
              />
              <div className='flex w-full flex-row items-center justify-between gap-6'>
                <div className='text-xs font-normal'>{data.key}</div>
                <div className='text-xs text-muted-foreground'>
                  {data.value.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
