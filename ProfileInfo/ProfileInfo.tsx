import {
  Alert,
  Button,
  ClinicDisplay,
  Input,
  InputSelector,
  Loader,
  Typography,
} from '@/components';
import AppDatePicker from '@/components/custom/AppDatePicker/AppDatePicker';
import ImageUpload from '@/components/custom/ImageUpload/ImageUpload';
import PhoneLabelInput from '@/components/custom/PhoneInput/PhoneLabelInput';
import { useUserRoles } from '@/hooks';
import { usStates } from '@/pages/auth/ProfileSetup/statesList';
import { useState } from 'react';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';

import ClinicAdminProfileOverview from './ClinicAdminProfileOverview';
import useEditProfile from './useProfileInfo';

const EditProfile = () => {
  const {
    unconfirmedEmail,
    formData,
    handleInputChange,
    handleSubmit: baseHandleSubmit,
    handleEmailChange,
    message,
    userStateLoading,
    profileImgPreviewUrl,
    updateUserLoading,
    selectedProfileImage,
    setSelectedProfileImage,
    sendEmailChangeOtpLoading,
    userState,
    zipCodeError,
    dateOfBirth,
    setDateOfBirth,
  } = useEditProfile();
  const {
    isSuperAdmin,
    isClient,
    isTeamMember,
    isClinicSuperAdmin,
    isPractitioner,
    isClinicAdmin,
  } = useUserRoles();

  // Phone validation state
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  // Helper for phone validation
  const validateUSPhoneNumber = (phoneValue: string | undefined): boolean => {
    if (!phoneValue || phoneValue === '+1') return false;
    try {
      const phoneNumber = parsePhoneNumber(phoneValue);
      if (!phoneNumber || phoneNumber.country !== 'US') return false;
      return isValidPhoneNumber(phoneValue, 'US');
    } catch {
      return false;
    }
  };

  // Custom handleSubmit to block invalid phone
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    // Validate phone before submit
    const valid = validateUSPhoneNumber(formData.phone);
    if (!valid) {
      setPhoneError('Please enter a valid US phone number');
      return;
    }
    setPhoneError(undefined);
    baseHandleSubmit(e);
  };

  if (userStateLoading)
    return (
      <div className="flex h-screen w-full justify-center">
        <Loader className="h-screen" />
      </div>
    );

  return (
    <>
      {(isSuperAdmin ||
        isPractitioner ||
        isClient ||
        isClinicAdmin ||
        isTeamMember) && (
        <div className="w-full rounded-lg border border-gray-200 bg-white p-4 xl:max-w-[703px]">
          <Typography
            variant="body1"
            as="h2"
            fontWeight="semibold"
            className="mb-4"
          >
            Profile Overview
          </Typography>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ImageUpload
              selectedFile={selectedProfileImage}
              setSelectedFile={setSelectedProfileImage}
              avatarSize="4xl"
              btnTitle="Upload Photo"
              changeTitle="Change Photo"
              imageUrl={profileImgPreviewUrl}
              maxSizeInMB={5}
            />
            <div className="grid gap-4 xl:grid-cols-2">
              <Input
                type="text"
                label="First Name"
                id="firstName"
                required
                value={formData.firstName}
                onChange={e => handleInputChange(e.target.value, 'firstName')}
                inputSize="sm"
              />
              <Input
                inputSize="sm"
                type="text"
                label="Last Name"
                id="lastName"
                required
                value={formData.lastName}
                onChange={e => handleInputChange(e.target.value, 'lastName')}
              />
            </div>
            {isPractitioner && <ClinicDisplay label="Clinic" />}
            {/* <div> */}
            <Input
              inputSize="sm"
              type="email"
              label="Email Address"
              id="emailAddress"
              className="gap-4"
              renderEmailChange={() => (
                <Button
                  type="button"
                  size="xs"
                  variant="link"
                  className="p-1"
                  disabled={sendEmailChangeOtpLoading}
                  loading={sendEmailChangeOtpLoading}
                  onClick={handleEmailChange}
                >
                  Change Email
                </Button>
              )}
              disabled={true}
              required
              value={formData.email}
              // onChange={e => handleInputChange(e.target.value, 'email')}
            />

            {message.text && (
              <Alert
                renderMessage={() => (
                  <Typography variant="body3" className="text-gray-700">
                    {message.text}
                    <br />
                    <span className="font-medium text-black">
                      {unconfirmedEmail}
                    </span>
                  </Typography>
                )}
                type={message.type}
              />
            )}
            <PhoneLabelInput
              label="Phone Number"
              id="phone"
              name="phone"
              inputSize="sm"
              required
              placeholder=""
              value={formData.phone}
              error={hasSubmitted ? phoneError : undefined}
              handleChange={(e: string | undefined) => {
                if (e !== undefined) handleInputChange(e, 'phone');
                if (hasSubmitted) {
                  // Revalidate on change only after submit attempt
                  const valid = validateUSPhoneNumber(e);
                  if (!valid) {
                    setPhoneError('Please enter a valid US phone number');
                  } else {
                    setPhoneError(undefined);
                  }
                }
              }}
              onValidationChange={valid => {
                if (hasSubmitted) {
                  if (!valid) {
                    setPhoneError('Please enter a valid US phone number');
                  } else {
                    setPhoneError(undefined);
                  }
                }
              }}
            />
            {(isClient || isPractitioner) && (
              <div>
                <InputSelector
                  placeholder="Select Gender"
                  label="Gender"
                  inputSize="sm"
                  selectedValue={formData.gender}
                  onValueChange={value => handleInputChange(value, 'gender')}
                  options={[
                    { key: 'Female', value: 'female' },
                    { key: 'Male', value: 'male' },
                    { key: 'Other', value: 'other' },
                  ]}
                  required
                />
              </div>
            )}
            {isClient && (
              <AppDatePicker
                inputSize="sm"
                dateValue={dateOfBirth}
                setDateValue={setDateOfBirth}
                label="Date of Birth"
              />
            )}
            {(isClient || isPractitioner || isClinicAdmin || isTeamMember) && (
              <>
                <Input
                  type="text"
                  label="Address"
                  id="address"
                  required
                  inputSize="sm"
                  value={formData.address}
                  onChange={e => handleInputChange(e.target.value, 'address')}
                />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Input
                    id="city"
                    label="City"
                    onChange={e => handleInputChange(e.target.value, 'city')}
                    required
                    inputSize="sm"
                    type="text"
                    value={formData.city}
                  />
                  <InputSelector
                    placeholder="Select State"
                    label="State"
                    inputSize="sm"
                    contentClassName="max-h-[200px]"
                    selectedValue={formData.state || userState.state || ''}
                    defaultValue={formData.state || userState.state || ''}
                    onValueChange={value => handleInputChange(value, 'state')}
                    options={usStates.map(state => ({
                      key: state.name,
                      value: state.name,
                    }))}
                    required
                  />
                  <Input
                    id="zipCode"
                    inputSize="sm"
                    label="Zip Code"
                    onChange={e => handleInputChange(e.target.value, 'zipCode')}
                    required
                    type="text"
                    value={formData.zipCode}
                    isError={!!zipCodeError}
                    errorMessage={zipCodeError}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="self-end"
              size="sm"
              loading={updateUserLoading}
              disabled={updateUserLoading}
            >
              Save Changes
            </Button>
          </form>
        </div>
      )}
      {isClinicSuperAdmin && <ClinicAdminProfileOverview />}
    </>
  );
};

export default EditProfile;
