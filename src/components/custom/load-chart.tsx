import { cn } from '@/lib/utils'
import ReactEcharts from 'echarts-for-react'
import { FC } from 'react'

export type LoadChartProps = {
  value: number
  centeralText?: string
  className?: string
}

export const LoadChart: FC<LoadChartProps> = (props) => {
  const option = (props: LoadChartProps) => ({
    series: [
      {
        type: 'gauge',
        center: ['50%', '50%'],
        startAngle: 235,
        endAngle: -55,
        min: 0,
        max: 100,
        splitNumber: 12,
        itemStyle: {
          color: 'blue',
        },
        progress: {
          show: true,
          width: 20,
          roundCap: 10,
        },
        pointer: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 20,
          },
          roundCap: 10,
        },
        axisTick: {
          show: false, // Axis tick çizgilerini kaldırır
        },
        splitLine: {
          show: true, // Çizgileri göstermek için 'true' yapıyoruz
          length: 2, // Çizgilerin uzunluğunu ayarlar (varsayılan genellikle daha büyüktür)
          distance: 5, // Çizgilerin eksenden uzaklığını ayarlar
          lineStyle: {
            width: 1,
            color: '#999',
          },
        },
        axisLabel: {
          show: false, // Sayıları kaldırır
        },
        anchor: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          lineHeight: 28,
          borderRadius: 8,
          fontSize: 17,
          fontWeight: 'bolder',
          formatter: props.centeralText,
          color: 'black',
          align: 'center',
        },
        data: [
          {
            value: props.value,
          },
        ],
      },
    ],
  })

  return (
    <ReactEcharts
      className={cn('min-h-10 min-w-24', props.className)}
      style={{ height: '' }}
      option={option(props)}
    />
  )
}
