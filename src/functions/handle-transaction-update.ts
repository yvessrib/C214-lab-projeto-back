import { updateProjectionForMonth } from "./update-projection-trigger";

interface UpdateTransactionRequest {
  id: string;
  title: string;
  description: string;
  value: number;
  installments: number;
  endsAt: Date | null;
  type: string;
  createdAt: Date;
}

export async function handleTransactionUpdate(oldTransaction: UpdateTransactionRequest, newTransaction: UpdateTransactionRequest){
  const { value, createdAt: oldCreatedAt, type: oldType} = oldTransaction;
  const { value: newValue, createdAt: newCreatedAt, type: newType } = newTransaction;

  const oldYear = oldCreatedAt.getFullYear();
  const oldMonth = oldCreatedAt.getMonth() + 1;
  const newYear = newCreatedAt.getFullYear();
  const newMonth = newCreatedAt.getMonth() + 1;

  if (value !== newValue || oldType !== newType){
    await updateProjectionForMonth(oldYear, oldMonth);
    if (oldYear !== newYear || oldMonth !== newMonth){
      await updateProjectionForMonth(newYear, newMonth);
    }
  }

  if (oldYear !== newYear || oldMonth !== newMonth){
    await updateProjectionForMonth(oldYear, oldMonth)
    await updateProjectionForMonth(newYear, newMonth);
  }
}