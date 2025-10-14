import { Facebook, Instagram, LinkedIn, TikTok, Twitter } from '@/assets/icons';
import {
  Alert,
  Button,
  Input,
  InputSelector,
  Loader,
  ThemeColorPanelRedux,
  Typography,
} from '@/components';
import ImageUpload from '@/components/custom/ImageUpload/ImageUpload';
import PhoneLabelInput from '@/components/custom/PhoneInput/PhoneLabelInput';
import { useTheme } from '@/hooks';
import { usStates } from '@/pages/auth/ProfileSetup/statesList';
import useClinicAdminProfile from '@/pages/auth/ProfileSetup/useClinicAdminProfile';
import { useState } from 'react';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';

const ClinicAdminProfileOverview = () => {
  const {
    unconfirmedEmail,
    formData,
    handleInputChange,
    handleSubmit: baseHandleSubmit,
    handleEmailChange,
    sendEmailChangeOtpLoading,
    message,
    selectedProfileImage,
    setSelectedProfileImage,
    selectedLogo,
    setSelectedLogo,
    setSelectedColor,
    updateClinicLoading,
    logoPreviewUrl,
    profileImgPreviewUrl,
    handlePhoneValidationChange,
    userStateLoading,
    clinicStateLoading,
    zipCodeError,
  } = useClinicAdminProfile();

  // Get theme from Redux store
  const { changeTheme } = useTheme();

  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  /**
   * Handle theme change from the Redux theme panel
   * This syncs the Redux theme with the local form state
   */
  const handleThemeChange = (themeIndex: number) => {
    // Update Redux theme
    changeTheme(themeIndex);
    // Also update local form state for backward compatibility
    setSelectedColor(themeIndex);
  };
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    const valid = validateUSPhoneNumber(formData.phone);
    if (!valid) {
      setPhoneError('Please enter a valid US phone number');
      return;
    }
    setPhoneError(undefined);
    baseHandleSubmit(e);
  };

  if (userStateLoading || clinicStateLoading)
    return (
      <div className="flex h-screen w-full justify-center">
        <Loader className="h-screen" />
      </div>
    );

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 xl:max-w-[703px]">
      <Typography
        variant="body1"
        as="h2"
        fontWeight="semibold"
        className="mb-4"
      >
        Profile Overview
      </Typography>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ImageUpload
            selectedFile={selectedLogo}
            setSelectedFile={setSelectedLogo}
            avatarSize="4xl"
            btnTitle="Upload Logo"
            changeTitle="Change Logo"
            imageUrl={logoPreviewUrl}
            avatarType="rectangle"
            removeLogoCall
            maxSizeInMB={5}
          />
          <ImageUpload
            selectedFile={selectedProfileImage}
            setSelectedFile={setSelectedProfileImage}
            avatarSize="4xl"
            btnTitle="Upload Photo"
            changeTitle="Change Photo"
            imageUrl={profileImgPreviewUrl}
            removeLogoCall={false}
            maxSizeInMB={5}
          />
        </div>
        <Input
          type="text"
          label="Clinic Name"
          id="clinicName"
          inputSize="sm"
          required
          value={formData.clinicName}
          onChange={e => handleInputChange(e.target.value, 'clinicName')}
          parentStyles=""
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="text"
            label="First Name"
            id="firstName"
            inputSize="sm"
            required
            value={formData.firstName}
            onChange={e => handleInputChange(e.target.value, 'firstName')}
            parentStyles=""
          />
          <Input
            inputSize="sm"
            id="lastName"
            label="Last Name"
            onChange={e => handleInputChange(e.target.value, 'lastName')}
            required
            type="text"
            value={formData.lastName}
          />
        </div>
        {/* <div> */}
        <Input
          inputSize="sm"
          type="email"
          label="Email"
          id="email"
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
        {/* <Typography variant="body3" className="mt-2 text-gray-700">
              Email verification is required in order to change the email
              address
            </Typography> */}
        {/* </div> */}
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
          label="Phone"
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
            handlePhoneValidationChange(valid);
          }}
        />
        <Input
          inputSize="sm"
          type="text"
          label="Address"
          id="address"
          required
          value={formData.address}
          onChange={e => handleInputChange(e.target.value, 'address')}
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Input
            id="city"
            label="City"
            inputSize="sm"
            onChange={e => handleInputChange(e.target.value, 'city')}
            required
            type="text"
            value={formData.city}
          />
          <div>
            <InputSelector
              placeholder="Select State"
              label="State"
              inputSize="sm"
              selectedValue={formData.state}
              defaultValue={formData.state}
              onValueChange={value => handleInputChange(value, 'state')}
              options={usStates.map(state => ({
                key: state.name,
                value: state.name,
                label: state.name,
              }))}
              required
            />
          </div>
          <Input
            inputSize="sm"
            id="zipCode"
            label="Zip Code"
            onChange={e => handleInputChange(e.target.value, 'zipCode')}
            required
            type="text"
            value={formData.zipCode}
            isError={!!zipCodeError}
            errorMessage={zipCodeError}
          />
        </div>
        <Input
          inputSize="sm"
          type="text"
          label="Website"
          id="website"
          rightLabelElement={<span className="text-gray-700"> (Optional)</span>}
          value={formData.website}
          onChange={e => handleInputChange(e.target.value, 'website')}
          isUrlField={true}
          urlValidation={true}
        />
        <div className="space-y-2">
          <div>
            <Typography variant="body3" fontWeight="medium">
              Theme
            </Typography>
            <Typography variant="body3" className="text-gray-700">
              Select a theme color for your clinic. This will be applied to all
              users under your clinic.
            </Typography>
          </div>

          <ThemeColorPanelRedux
            onThemeChange={handleThemeChange}
            className="mt-2"
          />
        </div>
        <div className="space-y-2">
          <Typography variant="body3" fontWeight="medium">
            Social Links <span className="text-gray-700">(Optional)</span>
          </Typography>

          <Input
            inputSize="sm"
            type="text"
            placeholder="Facebook"
            id="facebook"
            leftIcon={Facebook}
            value={formData.facebookUrl}
            onChange={e => handleInputChange(e.target.value, 'facebookUrl')}
            isUrlField={true}
            urlValidation={true}
          />
          <Input
            inputSize="sm"
            type="text"
            placeholder="Twitter"
            id="twitter"
            leftIcon={Twitter}
            value={formData.twitterUrl}
            onChange={e => handleInputChange(e.target.value, 'twitterUrl')}
            isUrlField={true}
            urlValidation={true}
          />
          <Input
            inputSize="sm"
            type="text"
            placeholder="LinkedIn"
            id="linkedin"
            leftIcon={LinkedIn}
            value={formData.linkedinUrl}
            onChange={e => handleInputChange(e.target.value, 'linkedinUrl')}
            isUrlField={true}
            urlValidation={true}
          />
          <Input
            inputSize="sm"
            type="text"
            placeholder="Instagram"
            id="instagram"
            leftIcon={Instagram}
            value={formData.instagramUrl}
            onChange={e => handleInputChange(e.target.value, 'instagramUrl')}
            isUrlField={true}
            urlValidation={true}
          />
          <Input
            inputSize="sm"
            type="text"
            placeholder="TikTok"
            id="tiktok"
            leftIcon={TikTok}
            value={formData.tiktokUrl}
            onChange={e => handleInputChange(e.target.value, 'tiktokUrl')}
            isUrlField={true}
            urlValidation={true}
          />
        </div>
        <Button
          type="submit"
          className="self-end"
          size="sm"
          loading={updateClinicLoading}
          disabled={updateClinicLoading}
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ClinicAdminProfileOverview;
