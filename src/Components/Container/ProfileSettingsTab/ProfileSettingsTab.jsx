import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import { Form, Button, Divider, Checkbox, Image, Message, Container, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import * as profileAction from '../../../action/profileActions/profileActions';

class ProfileSettingsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagepreviewurl: '',
      imageUrl: '',
      emailSelected: false,
      inAppSelected: false,
      fullName: '',
      userName: '',
      bio: '',
      loadingImage: false,
      isSubmitDisabled: false
    };
  }

  async componentDidMount() {
    const { userDetails } = this.props;
    await this.setState({
      file: '',
      imageUrl: userDetails.img,
      emailSelected: userDetails.getEmailsNotification,
      inAppSelected: userDetails.getInAppNotification,
      fullName: userDetails.fullName,
      userName: userDetails.userName,
      bio: userDetails.bio
    });
  }

  handleFormInput = event => {
    this.setState({
      [event.target.name]: event.target.value,
      isSubmitDisabled: !event.target.value
    });
  };

  onToggleEmail = event => {
    const { emailSelected } = this.state;
    this.setState({
      emailSelected: !emailSelected
    });
  };

  onToggleInApp = event => {
    const { inAppSelected } = this.state;
    this.setState({
      inAppSelected: !inAppSelected
    });
  };

  handleDismiss = () => {
    const { clearFlashMessage } = this.props;
    clearFlashMessage();
  };

  handleImageChange = async event => {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onloadend = () => {
      this.setState({ file, imagepreviewurl: reader.result, loadingImage: true });
    };
    reader.readAsDataURL(file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'jo81d6fh');
    const upload = await Axios({
      method: 'post',
      url: 'https://api.cloudinary.com/v1_1/jesseinit/image/upload',
      data: formData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    });
    await this.setState(state => {
      return {
        state,
        imageUrl: upload.data.secure_url,
        loadingImage: false
      };
    });
  };

  validate = (fullName, userName, bio) => {
    return {
      fullName: Boolean(fullName),
      userName: Boolean(userName),
      bio: Boolean(bio)
    };
  };

  canBeSubmitted = () => {
    const { fullName, userName, bio } = this.state;
    const errors = this.validate(userName, fullName, bio);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    console.log('IsDisabled', isDisabled);
    return !isDisabled;
  };

  handleSubmit = event => {
    event.preventDefault();
    const { fullName, userName, bio, emailSelected, inAppSelected, imageUrl } = this.state;
    const { updateUserData, history } = this.props;

    const userUpdateData = {
      fullName,
      userName,
      bio,
      getInAppNotification: inAppSelected,
      getEmailsNotification: emailSelected,
      img: imageUrl
    };

    if (!userUpdateData.fullName) delete userUpdateData.fullName;
    if (!userUpdateData.userName) delete userUpdateData.userName;
    if (!userUpdateData.bio) delete userUpdateData.bio;
    if (!userUpdateData.img) delete userUpdateData.img;

    updateUserData(userUpdateData, history);
  };

  render() {
    const { userDetails, message, error, visible, loadingBtn } = this.props;
    const {
      fullName,
      userName,
      bio,
      imageUrl,
      inAppSelected,
      emailSelected,
      imagepreviewurl,
      loadingImage
    } = this.state;

    let $imagePreview = '';

    if (imagepreviewurl) {
      $imagePreview = <Image src={imagepreviewurl} alt="user avatar" width="150px" height="150px" circular />;
    }

    const errors = this.validate(fullName, userName, bio);

    console.log('ERRRRRRRORS FROM VALIDATE', Object.keys(errors).some(x => errors[x]));
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    return (
      <div>
        {message && visible ? (
          <Container>
            <Message onDismiss={this.handleDismiss} success size="small" content={message} />
          </Container>
        ) : null}
        {error && visible ? (
          <Container>
            <Message onDismiss={this.handleDismiss} error size="small" content={error} />
          </Container>
        ) : null}
        <Form>
          <div className="edit-profile-form-container">
            <div className="edit-profile-form-row">
              <div className="edit-profile-form-column">
                <p className="user-info">User Information</p>
                <Form.Field>
                  <input
                    data-testid="fullName"
                    ref={input => (this.fullName = input)}
                    type="text"
                    name="fullName"
                    defaultValue={userDetails.fullName}
                    required
                    value={fullName}
                    placeholder="Full Name"
                    onChange={this.handleFormInput}
                  />
                </Form.Field>
                <Form.Field>
                  <input
                    data-testid="userName"
                    ref={input => (this.userName = input)}
                    type="text"
                    name="userName"
                    defaultValue={userDetails.userName}
                    value={userName}
                    required
                    placeholder="User Name"
                    onChange={this.handleFormInput}
                  />
                </Form.Field>
                <Form.Field>
                  <input
                    data-testid="bio"
                    ref={input => (this.bio = input)}
                    type="text"
                    name="bio"
                    defaultValue={userDetails.bio}
                    value={bio}
                    required
                    placeholder="Tagline"
                    onChange={this.handleFormInput}
                  />
                </Form.Field>
              </div>
              <div className="upload-img">
                {$imagePreview || (
                  <Image
                    circular
                    src={imageUrl || 'https://res.cloudinary.com/jesseinit/image/upload/v1550502499/neon-ah/user.svg'}
                    width="150px"
                    height="150px"
                  />
                )}
                <label htmlFor="img-upload">
                  <span>
                    Update Image
                    <Loader className="loading" active={loadingImage} inline size="mini" />
                  </span>
                </label>
                <input
                  data-testid="image"
                  onChange={this.handleImageChange}
                  ref={image => (this.imgUpload = image)}
                  id="img-upload"
                  type="file"
                  accept="image/*"
                  role="button"
                />
              </div>
            </div>
          </div>
          <Divider className="divider" />
          <div className="edit-profile-form-container">
            <div className="edit-profile-form-notification">
              <p className="notification-info">Notification Settings</p>
              <div className="check-box">
                <Checkbox
                  data-testid="inAppNotification"
                  className="check-item"
                  label="Receive in-app notifications"
                  onClick={this.onToggleInApp}
                  checked={inAppSelected}
                />
              </div>

              <div className="check-box">
                <Checkbox
                  data-testid="emailNotification"
                  className="check-item"
                  label="Receive Email notifications"
                  onClick={this.onToggleEmail}
                  checked={emailSelected}
                />
              </div>
            </div>
            <Button
              type="submit"
              loading={loadingBtn}
              disabled={this.state.isSubmitDisabled}
              style={{ backgroundColor: '#2fb5ee', color: '#fff' }}
              content="Update Profile"
              onClick={this.handleSubmit}
            />
          </div>
        </Form>
      </div>
    );
  }
}

ProfileSettingsTab.propTypes = {
  userDetails: PropTypes.oneOfType([PropTypes.object]).isRequired,
  history: PropTypes.oneOfType([PropTypes.object]).isRequired,
  error: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  updateUserData: PropTypes.func.isRequired,
  clearFlashMessage: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const {
    profileReducer: { isLoading, error, isSelf, message, visible, loadingBtn }
  } = state;
  return {
    isLoading,
    error,
    isSelf,
    message,
    visible,
    loadingBtn
  };
};

const mapDispatchToProps = {
  updateUserData: profileAction.updateUserProfile,
  clearFlashMessage: profileAction.clearFlashMessage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSettingsTab);