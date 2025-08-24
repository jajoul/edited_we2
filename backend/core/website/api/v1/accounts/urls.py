from django.contrib.auth.views import LoginView
from django.urls import path
from .views import (
    register, CreateProfileView, CreatePersonalDetailView,
    ForgetPasswordView, GetUserTokenView, ChangePasswordView, GetUserTypeView,
    UserFullInfoView, SettingEditProfileView, SettingUsernameSendEmailView,
    SettingEditUsernameView, SettingProfileView, SettingEditProfileAvatarView,
    SettingEmailSendEmailView, SettingEditEmailView, SettingProfileAnswerView,
    test_view
)


app_name = 'v1/accounts'

urlpatterns = [
    #  User related endpoints
    path("user/create/", register, name="create_user"),
    path("profile/create/", CreateProfileView.as_view(), name="create_profile"),
    path("user-detail/create/", CreatePersonalDetailView.as_view(), name="create_personal_detail"),
    path("user/type/", GetUserTypeView.as_view(), name="get_user_type"),
    path("user/full-info/", UserFullInfoView.as_view(), name="user-full-info"),

    # Forget password related endpoints
    path("forget-password/", ForgetPasswordView.as_view(), name="init_forget_password"),
    path("forget-password/token/", GetUserTokenView.as_view(), name="get_user_token"),
    path("forget-password/change/", ChangePasswordView.as_view(), name="change_password"),

    path("login/", LoginView.as_view(), name="login"),
    
    # Profile
    path("setting/profile/", SettingProfileView.as_view(), name="setting-profile"),
    path("setting/edit/profile/", SettingEditProfileView.as_view(), name="setting-edit-profile"),
    path("setting/edit/profile/avatar/", SettingEditProfileAvatarView.as_view(), name="setting-edit-profile-avatar"),
    path("setting/edit/username/send_email/", SettingUsernameSendEmailView.as_view(), name="setting-edit-username-send-email"),
    path("setting/edit/username/", SettingEditUsernameView.as_view(), name="setting-edit-username"),
    path("setting/edit/email/send_email/", SettingEmailSendEmailView.as_view(), name="setting-edit-email-send-email"),
    path("setting/edit/email/", SettingEditEmailView.as_view(), name="setting-edit-email"),
    
    # question
    path("setting/profile/answer/", SettingProfileAnswerView.as_view(), name="setting-profile-answer"),
    path("test/", test_view, name="test_view"),
]
