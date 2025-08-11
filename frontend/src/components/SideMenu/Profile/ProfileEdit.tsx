import Inputs, { inputType } from "@/components/Inputs/Inputs";
import ViewHeaders from "../ViewHeaders/ViewHeaders";
import { getFilesBaseOnLanguages } from "@/layouts/language/language";
import React, { useContext, useState } from "react";
import { Context } from "@/assets/Provider/Provider";
import EditIcon from "@/assets/images/smallIcons/BlueEdit.svg";
import Buttons, { buttonTheme } from "@/components/Buttons/Buttons";
import { editProfile } from "@/assets/Api";
import { SET_USER_INFO } from "@/assets/Provider/types";
import ChangeInfoByToken from "./ChangeInfoByToken";

const ProfileEdit = (props: {
  setStep: (step: number) => void;
  close: () => void;
}) => {
  const { setStep, close } = props;
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [showSecondPage, setShowSecondPage] = useState<string | boolean>(false);

  const dataBox = (el: JSX.Element) => (
    <div className="weTooProfileEditBox">{el}</div>
  );

  const lang = getFilesBaseOnLanguages();

  const genders = [
    { name: lang["male"], value: 0, id: "male" },
    { name: lang["female"], value: 1, id: "female" },
    { name: lang["I_don't_want_to_say"], value: 2, id: "unknown" },
  ];

  const profileViewOptions = [
    { name: "Show", value: 1, id: "show" },
    { name: "don't show", value: 0, id: "dont_show" },
  ];

  const [infoState, setInfoState] = useState<{
    [key: string]: string | number | boolean;
  }>({
    firstName: state.userInfo?.profile?.first_name || "",
    lastName: state.userInfo?.profile?.last_name || "",
    gender: state.userInfo?.profile?.gender || 0,
    show_name_in_chat: false,
  });

  const changeInfo = (value: number | string | boolean, key: string) => {
    const newState = { ...infoState };
    newState[key] = value;
    setInfoState(newState);
  };

  const saveChanges = () => {
    if (!loading) {
      setLoading(true);
      editProfile(
        !!infoState.show_name_in_chat,
        String(infoState.firstName),
        String(infoState.lastName),
        Number(infoState.gender)
      )
        .then((res) => {
          if (res.status === 200) {
            dispatch({
              type: SET_USER_INFO,
              data: {
                userInfo: {
                  ...state.userInfo,
                  profile: {
                    ...state.userInfo?.profile,
                    first_name: infoState.firstName,
                    last_name: infoState.lastName,
                    gender: infoState.gender,
                    show_name_in_chat: infoState.show_name_in_chat,
                  },
                },
              },
            });
            close();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <ViewHeaders
        goHome={() =>
          !!showSecondPage ? setShowSecondPage(false) : setStep(0)
        }
        title="Profile"
        close={close}
      />
      {!!showSecondPage ? (
        <ChangeInfoByToken
          type={String(showSecondPage)}
          setShowSecondPage={setShowSecondPage}
          close={close}
        />
      ) : (
        <>
          {dataBox(
            <>
              <div className="weTooProfileEditGender">
                <div className="weTooProfileEditGender__label">
                  Show profile and name in chats
                </div>
                <div className="weTooProfileEditGender__selectionList">
                  {profileViewOptions.map((item, index) => (
                    <React.Fragment key={index}>
                      <input
                        onChange={(e) =>
                          changeInfo(!!item.value, "show_name_in_chat")
                        }
                        type="radio"
                        id={item.id}
                        name="show_name_in_chat"
                        value={item.value}
                      />
                      <label
                        htmlFor={item.id}
                        className={`WeTooPersianText weTooProfileEditGender__selectionList__label ${
                          !!item.value === infoState.show_name_in_chat &&
                          "weTooProfileEditGender__selectionList__label--active"
                        }`}
                      >
                        {item.name}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <Inputs
                onChange={(v) => changeInfo(v, "firstName")}
                type={inputType.text}
                value={String(infoState.firstName)}
                label="First name"
                className="weTooProfileEditInput"
                placeholder="First name"
              />
              <Inputs
                onChange={(v) => changeInfo(v, "lastName")}
                type={inputType.text}
                value={String(infoState.lastName)}
                className="weTooProfileEditInput"
                label="Last name"
                placeholder="Last name"
              />

              <div className="weTooProfileEditGender">
                <div className="weTooProfileEditGender__label">Gender</div>
                <div className="weTooProfileEditGender__selectionList">
                  {genders.map((item, index) => (
                    <React.Fragment key={index}>
                      <input
                        onChange={(e) =>
                          changeInfo(Number(e.target.value), "gender")
                        }
                        type="radio"
                        id={item.id}
                        name="Gender"
                        value={item.value}
                      />
                      <label
                        htmlFor={item.id}
                        className={`WeTooPersianText weTooProfileEditGender__selectionList__label ${
                          item.value === infoState.gender &&
                          "weTooProfileEditGender__selectionList__label--active"
                        }`}
                      >
                        {item.name}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </>
          )}

          {dataBox(
            <>
              <div className="weTooProfileEditInfoBox">
                <div className="weTooProfileEditInfoBox__label">
                  Username
                  <img
                    onClick={() => setShowSecondPage("userName")}
                    src={EditIcon}
                  />
                </div>
                <div className="weTooProfileEditInfoBox__content">
                  {state.userInfo?.user.username}
                </div>
              </div>
              <div className="weTooProfileEditInfoBox">
                <div className="weTooProfileEditInfoBox__label">
                  Email
                  <img
                    onClick={() => setShowSecondPage("email")}
                    src={EditIcon}
                  />
                </div>
                <div className="weTooProfileEditInfoBox__content">
                  {state.userInfo?.user.email}
                </div>
              </div>
            </>
          )}

          <Buttons
            label={"Confirm"}
            theme={buttonTheme.gradient}
            onClick={saveChanges}
            loading={loading}
            className="weTooProfileEditBtn"
          />
        </>
      )}
    </>
  );
};

export default ProfileEdit;
