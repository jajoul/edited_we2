import { useState } from "react";
import "./ProfileLogoNav.less";

import { ReactComponent as ProlileLogo } from "@/assets/images/smallIcons/profile.svg";
import SideMenu from "@/components/SideMenu/SideMenu";



const ProfileLogoNav = (props: { mobileShow?: boolean }) => {

    const { mobileShow } = props;
    const [showPanel, setShowPanel] = useState(false);




    return (
        <>
            <div className={`WeTooProfileLogoNav ${mobileShow && "WeTooProfileLogoNav--mobileShow"}`}>
                <div className="WeTooProfileLogoNav__burgerManuContainer" onClick={() => setShowPanel((pre) => !pre)}>

                    <div className="WeTooProfileLogoNav__burgerManu" ></div>
                </div>
                <div className={'WeTooProfileLogoNav__profileContainer'}>
                    <ProlileLogo className={'WeTooProfileLogoNav__profileContainer__logo'} />
                </div>

                <div className={"WeTooProfileLogoNav__profileModal"}>
                    <SideMenu hideMenu={() => setShowPanel(false)} show={showPanel} />
                </div>
            </div>


        </>

    );
};

export default ProfileLogoNav;
