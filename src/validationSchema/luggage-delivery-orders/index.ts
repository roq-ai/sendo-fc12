import * as yup from 'yup';

export const luggageDeliveryOrderValidationSchema = yup.object().shape({
  status: yup.string().required(),
  user_id: yup.string().nullable(),
  porter_id: yup.string().nullable(),
  airline_id: yup.string().nullable(),
});
