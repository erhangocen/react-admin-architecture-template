import { get, post, put } from '@/network';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { ZodSchema } from 'zod';

// FormType => Form Type
// ListResponseType => List Response Type
// GetResponseType => Get Response Type

export type BaseEditDialogType<FormType extends FieldValues> = {
  form: UseFormReturn<FormType>;
  onSubmit: (data: FormType) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPending: boolean;
  defaultValues?: FormType;
};

export interface BaseEditDialogProviderProps<
  FormType extends FieldValues,
  ListResponseType,
> {
  defaultValues?: FormType;
  onSuccess?: (item: ListResponseType) => Promise<void> | void;
  children?: ReactNode;
  resolver: ZodSchema<FormType>;
  endPoint: string;
  type: 'add' | 'update';
}

export interface BaseUpdateDialogProviderProps<
  FormType extends FieldValues,
  GetResponseType,
  ListResponseType,
> extends BaseEditDialogProviderProps<FormType, ListResponseType> {
  dataId: string;
  defaultValueMapper: (response: GetResponseType) => FormType;
  getDefaultValuesEndpoint?: string;
  queryKey?: string;
}

export const useBaseEditDialog: <
  FormType extends FieldValues,
  ListResponseType,
>(
  baseProps: BaseEditDialogProviderProps<FormType, ListResponseType>
) => BaseEditDialogType<FormType> = <
  FormType extends FieldValues,
  ListResponseType,
>(
  baseProps: BaseEditDialogProviderProps<FormType, ListResponseType>
) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormType>({
    resolver: zodResolver(baseProps.resolver),
  });

  useEffect(() => {
    form.reset(baseProps.defaultValues);
  }, [baseProps.defaultValues, open]);

  const editFnc: (data: FormType) => Promise<ListResponseType> = async (
    data: FormType
  ) => {
    let response;
    if (baseProps.type === 'add') {
      response = await post(baseProps.endPoint, data);
    }
    if (baseProps.type === 'update') {
      response = await put(baseProps.endPoint, data);
    }
    return response;
  };

  const { mutateAsync: edit, isPending } = useMutation({
    mutationFn: editFnc,
    onSuccess: async (updatedItem: ListResponseType) => {
      baseProps.onSuccess && (await baseProps.onSuccess(updatedItem));
      setOpen(false);
    },
    // onError: showe
  });

  const onSubmit = async (data: FormType) => {
    console.log(data);
    await edit(data);
  };

  return {
    open,
    setOpen,
    onSubmit,
    isPending,
    form,
    defaultValues: baseProps.defaultValues,
  };
};

export interface BaseUpdateDataDialogReturnType<
  FormType extends FieldValues,
  GetResponseType,
> extends BaseEditDialogType<FormType> {
  getDefaultValuesLoading: boolean;
  defaultValuesQueryResponse?: GetResponseType;
}

export const useBaseUpdateDataDialog: <
  FormType extends FieldValues,
  GetResponseType,
  ListResponseType,
>(
  baseProps: BaseUpdateDialogProviderProps<
    FormType,
    GetResponseType,
    ListResponseType
  >
) => BaseUpdateDataDialogReturnType<FormType, GetResponseType> = <
  FormType extends FieldValues,
  GetResponseType,
  ListResponseType,
>(
  baseProps: BaseUpdateDialogProviderProps<
    FormType,
    GetResponseType,
    ListResponseType
  >
) => {
  const [open, setOpen] = useState<boolean>();

  const getDefaultValuesById = async (id: string) => {
    const response: GetResponseType = await get(
      (baseProps.getDefaultValuesEndpoint ?? '') + `/${id}`
    );
    return response;
  };

  const {
    data: defaultValuesQueryResponse,
    isLoading: getDefaultValuesLoading,
  } = useQuery({
    queryFn: async () => await getDefaultValuesById(baseProps.dataId),
    queryKey: [baseProps.queryKey, baseProps.dataId, open],
    enabled: open === true,
  });

  const defaultValues = useMemo(() => {
    if (defaultValuesQueryResponse) {
      return baseProps.defaultValueMapper(defaultValuesQueryResponse);
    }
    return undefined;
  }, [defaultValuesQueryResponse, baseProps.defaultValueMapper, open]);

  const baseDialogProps = useBaseEditDialog<FormType, ListResponseType>({
    ...baseProps,
    defaultValues: defaultValues,
  });

  useEffect(() => {
    setOpen(baseDialogProps.open);
  }, [baseDialogProps]);

  return {
    ...baseDialogProps,
    getDefaultValuesLoading,
    defaultValuesQueryResponse,
  };
};
