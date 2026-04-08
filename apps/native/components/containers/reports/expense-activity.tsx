import { View, Text } from "react-native";
import React from "react";
import CashoryReportSummaryCard from "@/components/base/cashory-report-summary-card";
import PeriodBadge from "@/components/base/period-badge";
import CashoryReportBarChart from "@/components/base/cashory-report-bar-chart";
import CashorySectionHeader from "@/components/base/cashory-section-header";
import CashoryTransactionCard from "@/components/base/cashory-transaction-card";

const EXPENSE_CHART_DATA = [
  { label: "Jan", value: 900 },
  { label: "Feb", value: 1200 },
  { label: "Mar", value: 1300 },
  { label: "Apr", value: 800 },
  { label: "May", value: 600 },
  { label: "Jun", value: 700 },
  { label: "Jul", value: 500 },
];

const EXPENSE_HISTORY = [
  { title: "Monthly Rent", datetime: "27 Jul, 17:22 pm", amount: 350.0 },
  { title: "Groceries", datetime: "22 Jun, 09:30 am", amount: 120.4 },
];

export default function ExpenseActivity() {
  return (
    <View className="flex-col gap-y-5">
      {/* All Time / Monthly Summary */}
      <CashoryReportSummaryCard
        leftTitle="Total Expense"
        leftValue={16467.56}
        rightTitle="Monthly Expense"
        rightValue={500.5}
        type="expense"
      />

      {/* Overview section */}
      <View className="flex-col gap-y-3">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-h4 leading-6.25 text-brand-black dark:text-brand-white"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            Overview
          </Text>
          <PeriodBadge label="For Six Month" />
        </View>

        <CashoryReportBarChart
          data={EXPENSE_CHART_DATA}
          variant="expense"
          maxBarHeight={160}
        />
      </View>

      {/* Expense History */}
      <View className="flex-col gap-y-2.5">
        <CashorySectionHeader
          title="Expense History"
          rightTitle="See all"
          rightTitleClassName="text-brand-black dark:text-brand-white text-[12px] font-medium"
          onRightPress={() => {}}
        />
        {EXPENSE_HISTORY.map((item, index) => (
          <CashoryTransactionCard
            key={`expense-${index}`}
            title={item.title}
            datetime={item.datetime}
            amount={item.amount}
            type="expense"
          />
        ))}
      </View>
    </View>
  );
}
