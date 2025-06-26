import { IonIcon } from "@ionic/react";
import Avatar from "../Avatar/Avatar";
import { createOutline, pencilOutline, checkmark } from "ionicons/icons";
import { useAuth } from "../../store/store";
import { useState } from "react";
import { motion } from "framer-motion";
import classNames from "classnames";

const varinats = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function ProfileTab({ visible }: { visible: boolean }) {
  const { user, setUser, userInfo, setUserInfo } = useAuth((state) => ({
    user: state.user,
    setUser: state.setUser,
    userInfo: state.userInfo,
    setUserInfo: state.setUserInfo,
  }));

  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(userInfo?.userName || "");

  function handlePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        const base64String = reader.result;
        setUser({
          ...user,
          avatar: base64String as string,
        });
      };
    }
  }

  function handleUpdateName() {
    if (name.trim().length === 0 || !userInfo) return;
    setUserInfo({ ...userInfo, userName: name.trim() });
    setEditName(false);
  }

  return (
    <motion.div
      variants={varinats}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      exit="exit"
      className={classNames("p-2", { hidden: !visible })}
    >
      <div className="profile-pic group flex items-center justify-center relative">
        <input
          type="file"
          name="pic"
          accept="image/*"
          className=" hidden"
          id="pic-file"
          onChange={handlePicChange}
        />
        <Avatar
          className="avatar  h-20 w-20 ring-2 rounded-full object-cover ring-gray-300 p-1 dark:ring-gray-500"
          src={user.avatar}
        >
          <button
            type="button"
            onClick={() => {
              const fileInput = document.getElementById(
                "pic-file"
              ) as HTMLInputElement;
              fileInput.click();
            }}
            className="invisible absolute z-10 top-0 left-0 right-0 bottom-0 group-hover:visible  transition rounded-full  bg-gray-700 bg-opacity-50  flex items-center justify-center"
          >
            <IonIcon icon={pencilOutline} className="text-xl text-gray-100" />
          </button>
        </Avatar>
      </div>
      <div className="my-4">
        <table className="w-full text-left dark:text-gray-200">
          <tbody>
            <tr>
              <td className="font-semibold py-2 pr-4">Username</td>
              <td className="py-2">
                {editName ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-gray-700 text-white p-1 rounded w-full"
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateName}
                      className="ml-2 text-green-500 text-xl"
                    >
                      <IonIcon icon={checkmark} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>{userInfo?.userName}</span>
                    <button
                      type="button"
                      title="Edit name"
                      className="flex items-center ml-2"
                      onClick={() => setEditName(true)}
                    >
                      <IonIcon
                        icon={createOutline}
                        className="dark:text-gray-100"
                      />
                    </button>
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4">Email</td>
              <td className="py-2">{userInfo?.gmail}</td>
            </tr>
            <tr>
              <td className="font-semibold py-2 pr-4">Subscription</td>
              <td className="py-2">{userInfo?.subscriptionPlan}</td>
            </tr>
            {userInfo?.isPremium && (
              <tr>
                <td className="font-semibold py-2 pr-4">Premium Expiry Date</td>
                <td className="py-2">
                  {userInfo.premiumExpiryDate
                    ? new Date(
                        userInfo.premiumExpiryDate
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
