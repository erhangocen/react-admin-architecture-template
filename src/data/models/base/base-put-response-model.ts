export interface BasePutResponseModel<T> {
  id: string;
  updatedFields: Record<keyof T, any>;
}
