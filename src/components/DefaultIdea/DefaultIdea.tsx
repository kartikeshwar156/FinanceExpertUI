import { IonIcon } from "@ionic/react";
import { sendOutline } from "ionicons/icons";
import useChat from "../../store/store";
import classNames from "classnames";
import { createMessage } from "../../utils/createMessage";

export default function DefaultIdea({
  ideas,
  myclassNames,
}: {
  ideas: { idea: string; moreContext: string }[];
  myclassNames?: string;
}) {
  const addChat = useChat((state) => state.addChat);
  return (
    <div
      className={classNames(
        "md:grid md:grid-cols-2 md:grid-rows-1 md:items-stretch md:gap-2",
        myclassNames
      )}
    >
      {ideas.map((i) => (
        <button
          key={i.idea}
          className="border border-gray-600 bg-[#202123] hover:bg-[#2A2B32] mb-2 w-full text-left p-3 group rounded-lg shadow flex-1 md:flex-row md:items-center transition"
          onClick={() => {
            addChat(createMessage("user", i.moreContext, "text"));
            addChat(createMessage("assistant", "", "text"));
          }}
        >
          <div className="self-stretch w-11/12">
            <h3 className="font-bold text-gray-200">{i.idea}</h3>
            <p className="text-sm text-gray-400">{i.moreContext}</p>
          </div>

          <div className="btn text-gray-400 group-hover:text-gray-200 text-lg invisible duration-75 transition-all group-hover:visible">
            <IonIcon icon={sendOutline} />
          </div>
        </button>
      ))}
    </div>
  );
}
