export function calculateVariance(budgetAmount: number, actualCost: number) {
  return Number((budgetAmount - actualCost).toFixed(2));
}

export function calculateMaterialTotal(quantity: number, unitPrice: number) {
  return Number((quantity * unitPrice).toFixed(2));
}
