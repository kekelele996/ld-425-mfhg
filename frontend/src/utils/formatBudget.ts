export function formatBudget(value: number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(value);
}

export function getVarianceRate(budgetAmount: number, actualCost: number) {
  if (!budgetAmount) return 0;
  return Math.round((actualCost / budgetAmount) * 100);
}
