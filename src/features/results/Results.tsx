import React from "react";
import styles from "./Results.module.scss";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import Select from "react-select";
import clsx from "clsx";
import { BarChartLoader } from "components/loaders";

export interface Row {
  date: string;
  exercise: string;
  reps: number;
  weight: number;
  duration: number;
  distance: number;
  incline: number;
  resistance: number;
  isWarmup: string;
  note: string;
}

interface ResultsProps {
  rows: Row[];
}

interface Option {
  label: string;
  value: string;
}

interface ChartData {
  weight: number;
  duration: number;
  reps: number;
  date: string;
}

const Results: React.FC<ResultsProps> = ({ rows }) => {
  const [
    selectedExcercise,
    setSelectedExcercise
  ] = React.useState<Option | null>(null);

  const rowCount = React.useCallback(() => rows.length, [rows]);

  const groupByExcercise = (): Record<string, Row[]> => {
    const grouped: Record<string, Row[]> = {};
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (grouped[row.exercise]) {
        grouped[row.exercise].push(row);
      } else {
        grouped[row.exercise] = [row];
      }
    }
    return grouped;
  };

  const numberOfDifferentDays = () => {
    const days: string[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      days.push(format(new Date(row.date), "dd.MM.yyyy"));
    }
    return Array.from(new Set(days)).length;
  };

  const totalDistance = () => {
    return rows.map(r => r.distance).reduce((a, b) => a + b, 0) / 1000;
  };

  const totalWeight = () => {
    return rows.map(r => r.weight).reduce((a, b) => a + b, 0) / 1000;
  };

  const rowsByExcercise = groupByExcercise();

  let chartData: ChartData[] = [];
  const selectedMeta = {
    dataKey: "weight",
    unit: "kg"
  };
  if (selectedExcercise) {
    chartData = rowsByExcercise[selectedExcercise.value]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(row => ({
        weight: row.weight,
        duration: row.duration,
        reps: row.reps,
        date: format(new Date(row.date), "MM MMM")
      }));
    if (chartData.map(r => r.duration).reduce((a, b) => a + b, 0) > 0) {
      selectedMeta.dataKey = "duration";
      selectedMeta.unit = "s";
    }
    if (chartData.map(r => r.reps).reduce((a, b) => a + b, 0) > 0) {
      selectedMeta.dataKey = "reps";
      selectedMeta.unit = "reps";
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.totalSection}>
        <div className={styles.totalBlock}>
          <div className={clsx(styles.totalBubble, styles.orangeBorder)}>
            {numberOfDifferentDays()}
          </div>
          <h4>Days trained</h4>
        </div>
        <div className={styles.totalBlock}>
          <div className={clsx(styles.totalBubble, styles.orangeBorder)}>
            {rowCount()}
          </div>
          <h4>Sets logged</h4>
        </div>
      </div>
      <div className={styles.totalSection}>
        <div className={styles.totalBlock}>
          <div className={clsx(styles.totalBubble, styles.purpleBorder)}>
            {totalDistance().toFixed(0)}
          </div>
          <h4>Kilometers</h4>
        </div>
        <div className={styles.totalBlock}>
          <div className={clsx(styles.totalBubble, styles.purpleBorder)}>
            {totalWeight().toFixed(0)}
          </div>
          <h4>Tonnes</h4>
        </div>
      </div>
      <div className={styles.select}>
        <Select
          value={selectedExcercise}
          onChange={(selectedOption: any) =>
            setSelectedExcercise(selectedOption)
          }
          options={Object.keys(rowsByExcercise)
            .sort(
              (a, b) => rowsByExcercise[b].length - rowsByExcercise[a].length
            )
            .map(key => ({
              label: `${key} (${rowsByExcercise[key].length})`,
              value: key
            }))}
          theme={theme => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: "orange"
            }
          })}
        />
      </div>
      {selectedExcercise !== null ? (
        <div className={styles.performanceChart}>
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={{
                top: 40,
                right: 30,
                left: 0,
                bottom: 0
              }}
            >
              <CartesianGrid stroke="#666666" vertical={false} />
              <YAxis
                dataKey={selectedMeta.dataKey}
                unit={` ${selectedMeta.unit}`}
              />
              <XAxis dataKey="date" minTickGap={60} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={selectedMeta.dataKey}
                stroke="hsla(39, 50%, 50%, 1);"
                fill="orange"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <BarChartLoader />
      )}
      <footer className={styles.footerText}>Feature suggestions?</footer>
    </div>
  );
};

export default Results;
