import { useState, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { ArchiveChatBotApiService } from "../services/archive_chatbot_api";
import { useNavigate } from "react-router-dom";

export default function ArchiveConversations({
  createNewConversation,
  loadingConversations,
  conversations,
  openConversation,
  currentConversationId,
  refreshConversations,
  isArchived,
  isMobileOpen = false,
  onClose = () => {},
}) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [renamePopup, setRenamePopup] = useState(null);
  const [deletePopup, setDeletePopup] = useState(null);

  const navigate = useNavigate()

  const containerRef = useRef(null);

  const toggleMenu = (id) => {
    setMenuOpenFor((prev) => (prev === id ? null : id));
  };

  const closeMenu = () => setMenuOpenFor(null);

  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        closeMenu();
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const PanelContent = (
    <div
      ref={containerRef}
      className={`w-50 m-1 ml-0 ${isLight ? "text-black" : "text-white"} rounded-2xl p-3 relative overflow-hidden`}
    >
      <div className="absolute top-0 left-0 w-full h-full "></div>
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-xl"></div>

      <div className="flex items-center w-40 justify-between mb-4 relative z-10">
        <div className="text-base font-semibold tracking-wide drop-shadow-sm">
          {isArchived ? "Archived Chats" : "Recent Chats"}
        </div>

        <button
          onClick={createNewConversation}
          className="text-sm cursor-pointer w-6 h-6 font-semibold rounded-lg bg-gray-400 border border-white/25 shadow-lg hover:bg-white/25 transition-all duration-300 hover:scale-110 hover:shadow-2xl flex items-center justify-center"
          
        >
          +
        </button>
      </div>

      <div className="min-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar relative z-10 h-full" style={{ maxHeight: "calc(100vh - 160px)" }}>
        {loadingConversations && (
          <div className="flex items-center justify-center py-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/60"></div>
          </div>
        )}

        {conversations.map((c) => (
          <div key={c.id} className="relative group">
            <div
              onClick={() => menuOpenFor !== c.id && openConversation(c.id, c.title)}
              className={`pt-1.5 flex items-center justify-between gap-2 pb-1.5 pl-2 pr-1 rounded-xl w-42 mb-2 cursor-pointer transition-all duration-300 backdrop-blur-sm border ${
                c.id === currentConversationId
                  ? `   ${isLight ? "bg-[#8c719c] hover:bg-[#b39cc0] " : "bg-white/30 hover:bg-white/40 "} border-white/30  shadow-inner`
                  : `  ${isLight ? "bg-[#B9A3C7] hover:bg-[#9b7fab] " : "bg-white/10 hover:bg-white/20"} border-white/15  hover:border-white/25`
              } hover:shadow-lg`}
            >
              <div className="relative overflow-hidden w-full" title={c.title}>
                <div className="inline-block whitespace-nowrap text-sm text-white/90 drop-shadow-sm">
                  {c.title ? (c.title.length > 20 ? c.title.slice(0, 18) + "..." : c.title) : "Untitled"}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(c.id);
                }}
                className="px-2 pr-3 text-white/80 hover:text-white transition opacity-0 group-hover:opacity-100"
                aria-label="Open conversation menu"
                type="button"
              >
                ⋮
              </button>
            </div>

            {menuOpenFor === c.id && (
              <div
                className="absolute right-0 top-9 w-36 text-black bg-[#E9D9E3] backdrop-blur-md shadow-lg border border-gray-200 rounded-lg p-1 z-50 animate-fadeIn"
                onMouseLeave={closeMenu}
              >
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-200 rounded-md"
                  onClick={() => {
                    setRenamePopup({ id: c.id, title: c.title });
                    closeMenu();
                  }}
                >
                  Rename
                </button>

                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-200 rounded-md"
                  onClick={async () => {
                    await ArchiveChatBotApiService.unArchiveConversation(c.id);
                    refreshConversations();
                    closeMenu();
                  }}
                >
                  UnArchive
                </button>

                <button
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-100 rounded-md"
                  onClick={() => {
                    setDeletePopup({ id: c.id, title: c.title });
                    closeMenu();
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {conversations.length === 0 && !loadingConversations && (
          <div className="text-xs text-white/70 text-center py-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/15">
            No conversations yet — create one.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{PanelContent}</div>

      {isMobileOpen && (
        <div
          className="fixed h-[85vh] w-100 rounded-2xl z-50 md:hidden"
          
        >
          <div
            className="absolute inset-0 bg-transparent"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className={`absolute left-0 top-0 bottom-0 w-11/12 max-w-xs  backdrop-blur-md rounded-2xl p-3 overflow-auto
            ${isLight ? "bg-[#e9d9e3] border border-[#1d0e2d9c] " : "bg-[#1d0e2d] border border-white/30"}
            `}>
            <div className={`flex items-center justify-between mb-3
                  ${isLight ? "text-black" : "text-white"}`}>
              <div className="text-lg font-semibold">{isArchived ? "Archived Chats" : "Recent Chats"}</div>
             
              <button
                onClick={() => {
                  createNewConversation();
                  onClose();
                }}
                className="w-8 h-8 rounded-md bg-gray-400 flex items-center justify-center text-white"
        
              >
                +
              </button>

            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 140px)" }}>
              {loadingConversations && (
                <div className="flex items-center justify-center py-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/60"></div>
                </div>
              )}

              {conversations.map((c) => (
                <div key={c.id} className="mb-2 relative">
                  <div
                    onClick={() => {
                      openConversation(c.id, c.title);
                      onClose();
                    }}
                    className={`pt-2 pb-2 pl-3 pr-2 rounded-lg cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      c.id === currentConversationId
                        ? `${isLight ? "bg-[#8c719c]" : "bg-white/30"}`
                        : `${isLight ? "bg-[#B9A3C7]" : "bg-white/10"}`
                    }`}
                    title={c.title}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white/90 truncate">
                        {c.title ? (c.title.length > 40 ? c.title.slice(0, 36) + "..." : c.title) : "Untitled"}
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(c.id);
                        }}
                        className="p-1 rounded-md text-white/80 bg-white/5 hover:bg-white/10"
                        aria-label={`Open menu for ${c.title || "conversation"}`}
                        type="button"
                      >
                        ⋮
                      </button>
                    </div>
                  </div>

                  {menuOpenFor === c.id && (
                    <div className="mt-2 ml-2 mr-2 bg-[#E9D9E3] text-black rounded-lg shadow-lg border border-gray-200 p-2 z-50 animate-fadeIn">
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-200 rounded-md"
                        onClick={() => {
                          setRenamePopup({ id: c.id, title: c.title });
                          closeMenu();
                        }}
                      >
                        Rename
                      </button>

                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-200 rounded-md"
                        onClick={async () => {
                          await ArchiveChatBotApiService.unArchiveConversation(c.id);
                          refreshConversations();
                          closeMenu();
                        }}
                      >
                        UnArchive
                      </button>

                      <button
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-100 rounded-md"
                        onClick={() => {
                          setDeletePopup({ id: c.id, title: c.title });
                          closeMenu();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {conversations.length === 0 && !loadingConversations && (
                <div className="text-sm text-white/70 p-2">No conversations yet — create one.</div>
              )}
            </div>

               <div className="absolute bottom-4 left-22" >
            <button
              onClick={() =>
                navigate("/loading", { state: { nextPage: "/chatbot" } })
              }
              className={`py-2 px-3 text-md rounded-lg text-white font-semibold ${
                isLight
                  ? "bg-linear-to-r from-[#4f4d4f]  to-[#bdbcbd]"
                  : "bg-white/10"
              }`}
            >
              Recent Chats
            </button>
            </div>

          </div>
        </div>
      )}

      {renamePopup && (
        <div className="fixed inset-0 text-black bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#E9D9E3] p-5 rounded-lg shadow-lg w-80 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-3">Rename Conversation</h2>

            <input
              value={renamePopup.title}
              onChange={(e) => setRenamePopup({ ...renamePopup, title: e.target.value })}
              className="w-full border border-gray-500 p-2 rounded-xl mb-4 focus:outline-none focus:ring-0"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setRenamePopup(null)} className="px-3 py-1 bg-gray-300 rounded">
                Cancel
              </button>

              <button
                onClick={async () => {
                  await ArchiveChatBotApiService.renameConversation(renamePopup.id, renamePopup.title);
                  setRenamePopup(null);
                  refreshConversations();
                }}
                className="px-3 py-1 bg-green-400 shadow-2xl text-white rounded"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {deletePopup && (
        <div className="fixed inset-0 bg-black/50 text-black flex items-center justify-center z-50">
          <div className="bg-white/10 border border-white/30 backdrop-blur-2xl p-5 rounded-lg shadow-lg w-80 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-3">Delete Conversation</h2>

            <p className="text-sm mb-4">
              Are you sure you want to delete <strong>{deletePopup.title}</strong>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletePopup(null)}
                className="px-2 py-1 bg-gray-200 text-sm rounded cursor-pointer hover:scale-105 shadow-lg transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await ArchiveChatBotApiService.deleteConversation(deletePopup.id);
                  setDeletePopup(null);
                  refreshConversations();
                }}
                className="px-2 py-1 bg-red-600 text-sm text-white rounded cursor-pointer hover:scale-105 shadow-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}




