import { ToastAlert } from '@/components';
import { backendURL } from '@/config';
import { SEND_EMAIL_CHANGE_OTP } from '@/graphql/mutations/authMutations';
import { UPDATE_USER } from '@/graphql/mutations/userMutations';
import { useUserRoles } from '@/hooks';
import useFormErrorHandler from '@/hooks/useFormHandler';
import useZipCodeValidation from '@/pages/auth/ProfileSetup/useZipCodeValidation';
import { setUserState } from '@/redux/slices/userSlice';
import type { RootState } from '@/redux/store';
import { useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import type { Value } from 'react-date-picker/dist/shared/types.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const useEditProfile = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user.user);
  const [profileImgPreviewUrl, setProfileImgPreviewUrl] = useState('');
  const {
    isSuperAdmin,
    isClient,
    isPractitioner,
    isClinicAdmin,
    isTeamMember,
  } = useUserRoles();
  const [dateOfBirth, setDateOfBirth] = useState<Value>(
    userState?.dateOfBirth ? new Date(userState.dateOfBirth) : null,
  );

  const userStateLoading = useSelector(
    (state: RootState) => state.user.loading,
  );
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: userState.email || '',
    phone: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [unconfirmedEmail] = useState('');
  const { message } = useFormErrorHandler();
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(
    null,
  );
  const navigate = useNavigate();
  const [zipCodeError, setZipCodeError] = useState<string | undefined>(
    undefined,
  );
  const { validateZipCode } = useZipCodeValidation();

  // handle the input change event
  const handleInputChange = (
    inputData: string | boolean,
    inputName: string,
  ) => {
    setFormData(prevState => ({
      ...prevState,
      [inputName]: inputData,
    }));
    if (inputName === 'zipCode') {
      setZipCodeError(undefined);
    }
  };

  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATE_USER);
  // call the mutation to get the otp
  const [sendEmailChangeOtp, { loading: sendEmailChangeOtpLoading }] =
    useMutation(SEND_EMAIL_CHANGE_OTP);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Zip code validation (skip for SuperAdmin)
    if (!isSuperAdmin) {
      const isZipValid = validateZipCode(formData.zipCode);
      if (!isZipValid) {
        setZipCodeError('Please enter a valid US zip code');
        return;
      }
      setZipCodeError(undefined);
    }

    // Build variables object based on user role
    let variables: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      image?: File;
      gender?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      dateOfBirth?: string | null; // <-- change here
    } = {};

    // Helper to conditionally add image if selected
    const maybeImage = selectedProfileImage
      ? { image: selectedProfileImage }
      : {};

    if (isClinicAdmin) {
      variables = {
        ...maybeImage,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      };
    } else if (isSuperAdmin) {
      variables = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...maybeImage,
        phone: formData.phone,
      };
    } else if (isPractitioner) {
      variables = {
        ...maybeImage,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      };
    } else if (isTeamMember) {
      variables = {
        ...maybeImage,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      };
    } else if (isClient) {
      variables = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...maybeImage,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        dateOfBirth: dateOfBirth
          ? format(dateOfBirth as Date, 'yyyy-MM-dd')
          : null,
      };
    }

    try {
      await updateUser({
        variables,
        onCompleted: res => {
          const user = res.updateUser.user;

          if (user.email) {
            dispatch(setUserState(user));
            ToastAlert('Changes are saved.');
            setSelectedProfileImage(null);
          }
        },

        onError: error => {
          if (error instanceof Error) {
            ToastAlert(error.message, false);
            console.error('error while updating the user: ', error);
          }
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlert(error.message, false);
        console.error('error while updating the user: ', error);
      }
    }
  };

  // update email
  const handleEmailChange = async () => {
    try {
      // call the api to get the email otp
      await sendEmailChangeOtp({
        onCompleted: res => {
          const message = res.sendEmailChangeOtp.message;
          ToastAlert(message);
          console.log(message.match(/\d{6}/)?.[0]);

          // redirect to /change-email
          localStorage.setItem('redirectTo', '/change-password');
          navigate('/email-otp-verification', { state: { resetTimer: true } });
        },
        onError: error => {
          console.log('error while send email change otp:', error);
          ToastAlert(error.message, false);
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlert(error.message, false);
        console.log('error while send email change otp:', error);
      }
    }
  };

  // fill the form data from the user state.
  useEffect(() => {
    if (userState) {
      setFormData(prev => ({
        ...prev,
        firstName: userState.firstName ?? prev.firstName,
        lastName: userState.lastName ?? prev.lastName,
        address: userState.address ?? prev.address,
        email: userState.email ?? prev.email,
        city: userState.city ?? prev.city,
        state: userState.state ?? prev.state,
        zipCode: userState.zipCode ?? prev.zipCode,
        phone: userState.phone ?? prev.phone,
        // website: userState.website ?? prev.website,
        gender: userState.gender ?? prev.gender,
      }));
    }

    if (userState.dateOfBirth) {
      setDateOfBirth(new Date(userState.dateOfBirth));
    } else {
      setDateOfBirth(null);
    }

    if (
      userState &&
      typeof userState.imageUrl === 'string' &&
      userState.imageUrl.trim() !== ''
    ) {
      setProfileImgPreviewUrl(`${backendURL}${userState.imageUrl}`);
    } else {
      setProfileImgPreviewUrl('');
    }
  }, [userState]);

  return {
    unconfirmedEmail,
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleEmailChange,
    userStateLoading,
    selectedProfileImage,
    message,
    updateUserLoading,
    setSelectedProfileImage,
    userState,
    profileImgPreviewUrl,
    sendEmailChangeOtpLoading,
    zipCodeError,
    setZipCodeError,
    dateOfBirth,
    setDateOfBirth,
  };
};

export default useEditProfile;
