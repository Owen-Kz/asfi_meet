import ParticipantsView from '../../components/ParticipantsView';
import Chat from '../../components/Chat';
import Navbar, {
  MeetingTitleToolbarItem,
  ParticipantCountToolbarItem,
  RecordingStatusToolbarItem,
  ChatToolbarItem,
  ParticipantToolbarItem,
  SettingsToobarItem,
  PostersToolbarItem,
} from '../../components/Navbar';
import Controls, {
  LayoutToolbarItem,
  InviteToolbarItem,
  RaiseHandToolbarItem,
  LocalAudioToolbarItem,
  LocalVideoToolbarItem,
  SwitchCameraToolbarItem,
  ScreenShareToolbarItem,
  RecordingToolbarItem,
  LocalEndcallToolbarItem,
} from '../../components/Controls';
import ChatBubble from '../../subComponents/ChatBubble';
import {ChatInput} from '../../subComponents/ChatInput';
import {ChatAttachmentButton} from '../../subComponents/chat/ChatAttachment';
import ChatSendButton from '../../subComponents/chat/ChatSendButton';
import ChatUploadStatus from '../../subComponents/chat/ChatUploadStatus';
import {ChatEmojiButton} from '../../subComponents/chat/ChatEmoji';
import SettingsView from '../../components/SettingsView';
import WhiteboardButton from '../../components/whiteboard/WhiteboardButton';
import PostersView from '../../components/PostersView';


const ToolbarComponents = {
  MeetingTitleToolbarItem,
  ParticipantCountToolbarItem,
  RecordingStatusToolbarItem,
  ChatToolbarItem,
  ParticipantToolbarItem,
  SettingsToobarItem,
  PostersToolbarItem,
  LayoutToolbarItem,
  InviteToolbarItem,
  RaiseHandToolbarItem,
  LocalAudioToolbarItem,
  LocalVideoToolbarItem,
  SwitchCameraToolbarItem,
  ScreenShareToolbarItem,
  RecordingToolbarItem,
  LocalEndcallToolbarItem,
  WhiteboardToolbarItem: WhiteboardButton,
};
export {
  ParticipantsView,
  Chat,
  Navbar,
  SettingsView,
  PostersView,
  Controls,
  ChatBubble,
  ChatInput,
  ChatAttachmentButton,
  ChatEmojiButton,
  ChatUploadStatus,
  ChatSendButton,
  ToolbarComponents,
};
