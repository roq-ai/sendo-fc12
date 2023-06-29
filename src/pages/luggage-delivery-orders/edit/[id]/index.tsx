import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getLuggageDeliveryOrderById, updateLuggageDeliveryOrderById } from 'apiSdk/luggage-delivery-orders';
import { Error } from 'components/error';
import { luggageDeliveryOrderValidationSchema } from 'validationSchema/luggage-delivery-orders';
import { LuggageDeliveryOrderInterface } from 'interfaces/luggage-delivery-order';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { PorterInterface } from 'interfaces/porter';
import { AirlineInterface } from 'interfaces/airline';
import { getUsers } from 'apiSdk/users';
import { getPorters } from 'apiSdk/porters';
import { getAirlines } from 'apiSdk/airlines';

function LuggageDeliveryOrderEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<LuggageDeliveryOrderInterface>(
    () => (id ? `/luggage-delivery-orders/${id}` : null),
    () => getLuggageDeliveryOrderById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: LuggageDeliveryOrderInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateLuggageDeliveryOrderById(id, values);
      mutate(updated);
      resetForm();
      router.push('/luggage-delivery-orders');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<LuggageDeliveryOrderInterface>({
    initialValues: data,
    validationSchema: luggageDeliveryOrderValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Luggage Delivery Order
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
              <FormLabel>Status</FormLabel>
              <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
              {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<PorterInterface>
              formik={formik}
              name={'porter_id'}
              label={'Select Porter'}
              placeholder={'Select Porter'}
              fetcher={getPorters}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<AirlineInterface>
              formik={formik}
              name={'airline_id'}
              label={'Select Airline'}
              placeholder={'Select Airline'}
              fetcher={getAirlines}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'luggage_delivery_order',
    operation: AccessOperationEnum.UPDATE,
  }),
)(LuggageDeliveryOrderEditPage);
