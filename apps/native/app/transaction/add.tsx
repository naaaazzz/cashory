import { View, ActivityIndicator, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCategories } from "@/hooks/use-categories";
import { useWallets } from "@/hooks/use-wallet";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { SelectOption, TransactionStep } from "@/types/transactions";
import CashoryScreenHeader from "@/components/base/cashory-screen-header";
import StepProgressBar from "@/components/base/step-progress-bar";
import TransactionTypeStep from "@/components/containers/transactions/transaction-type-step";
import TransactionFormStep from "@/components/containers/transactions/transaction-form-step";
import ActionButton from "@/components/ui/action-button";
import { createTransactionSchema } from "@cashory-demo/schema/transaction.schema";
import { CashoryDateTimePicker } from "@/components/containers/cashory-date-time-picker";
import { formatDateTime } from "@/lib/format";
import CashoryConfirmationModal from "@/components/base/cashory-confirmation-modal";
import TransactionSummaryStep from "@/components/containers/transactions/transaction-summary-step";

function getWalletEmoji(type: string | undefined) {
  if (type === "bank") return "[Bank]";
  if (type === "credit") return "[Card]";
  if (type === "cash") return "[Cash]";
  return "[Wallet]";
}

export default function AddTransaction() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const transactionType = type === "expense" ? "expense" : "income";
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [currentStep, setCurrentStep] = useState<TransactionStep>(1);
  const [selectedWallet, setSelectedWallet] = useState<SelectOption | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | undefined>();
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDateConfirmed, setIsDateConfirmed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories(transactionType);
  const { data: walletsData, isLoading: isLoadingWallets } = useWallets();
  const createTransaction = useCreateTransaction();

  const categories: SelectOption[] =
    categoriesData?.map((cat: any) => ({
      value: cat.id,
      label: cat.emoji ? `${cat.emoji} ${cat.name}` : cat.name,
    })) || [];

  const wallets: SelectOption[] =
    walletsData?.data?.map((wallet: any) => ({
      value: wallet.id,
      label: `${getWalletEmoji(wallet.type)} ${wallet.name}`,
    })) || [];

  useEffect(() => {
    if (!selectedWallet && wallets.length === 1) {
      setSelectedWallet(wallets[0]);
    }
  }, [selectedWallet, wallets]);

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
      return;
    }

    setCurrentStep((prev) => (prev - 1) as TransactionStep);
  };

  const validateStepTwo = () => {
    if (!selectedWallet) {
      Alert.alert("Validation", "Please select a wallet.");
      return false;
    }

    if (!amount.trim()) {
      Alert.alert("Validation", "Please enter an amount.");
      return false;
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Validation", "Please enter a valid amount greater than 0.");
      return false;
    }

    const validation = createTransactionSchema.safeParse({
      walletId: selectedWallet.value,
      categoryId: selectedCategory?.value || undefined,
      type: transactionType,
      amount: numericAmount,
      description: selectedCategory?.label || "Transaction",
      note: note.trim() || undefined,
      transactionDate: selectedDate.toISOString(),
    });

    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      const message =
        firstIssue?.path[0] === "walletId"
          ? "Please select a wallet."
          : firstIssue?.path[0] === "amount"
            ? "Please enter a valid amount greater than 0."
            : firstIssue?.path[0] === "transactionDate"
              ? "Please choose a valid date and time."
              : firstIssue?.message || "Please fill all required fields.";

      Alert.alert("Validation", message);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 2 && !validateStepTwo()) {
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as TransactionStep);
    }
  };

  const handleButtonPress = () => {
    if (currentStep < 3) {
      handleNext();
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    try {
      if (!selectedWallet) {
        Alert.alert("Validation", "Please select a wallet.");
        setShowConfirmModal(false);
        return;
      }

      await createTransaction.mutateAsync({
        walletId: selectedWallet.value,
        categoryId: selectedCategory?.value,
        type: transactionType,
        amount: Number(amount),
        description: selectedCategory?.label || "Transaction",
        note: note.trim() || undefined,
        transactionDate: selectedDate.toISOString(),
      });

      setShowConfirmModal(false);
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create transaction");
      setShowConfirmModal(false);
    }
  };

  const dateDisplay = isDateConfirmed ? formatDateTime(selectedDate) : null;
  const buttonLabel = currentStep < 3 ? "Next" : "Confirmation";
  const isLoadingData = isLoadingCategories || isLoadingWallets;

  if (isLoadingData) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-flashwhite dark:bg-brand-green-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-brand-flashwhite dark:bg-brand-green-900"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-2.5 mt-7.5 w-full">
        <CashoryScreenHeader
          title="Add Transaction"
          showBack={true}
          onBack={handleBack}
        />
      </View>

      <StepProgressBar currentStep={currentStep} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {currentStep === 1 && <TransactionTypeStep transactionType={transactionType} />}
        {currentStep === 2 && (
          <TransactionFormStep
            amount={amount}
            onAmountChange={setAmount}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedWallet={selectedWallet}
            onWalletChange={setSelectedWallet}
            dateDisplay={dateDisplay}
            onDatePress={() => setShowDatePicker(true)}
            note={note}
            onNoteChange={setNote}
            categories={categories}
            wallets={wallets}
          />
        )}
        {currentStep === 3 && (
          <TransactionSummaryStep
            amount={amount}
            selectedCategory={selectedCategory}
            selectedWallet={selectedWallet}
            selectedDate={selectedDate}
            isDateConfirmed={isDateConfirmed}
            note={note}
            categories={categories}
            wallets={wallets}
          />
        )}
      </ScrollView>

      <View className="px-20.5 pb-2">
        <ActionButton
          label={createTransaction.isPending ? "Saving..." : buttonLabel}
          onPress={handleButtonPress}
          className="w-full"
          disabled={createTransaction.isPending}
        />
      </View>

      <CashoryDateTimePicker
        visible={showDatePicker}
        value={selectedDate}
        onDateChange={setSelectedDate}
        onConfirm={() => {
          setIsDateConfirmed(true);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <CashoryConfirmationModal
        visible={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
      />
    </View>
  );
}
