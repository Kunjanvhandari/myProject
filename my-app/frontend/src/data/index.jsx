import { BiSolidFolderMinus, BiSolidMessageDetail } from "react-icons/bi";
import {
  BsFillBellFill,
  BsFillPlayFill,
  BsImage,
  BsThreeDotsVertical,
} from "react-icons/bs";
import ShareIcon from "@mui/icons-material/Share";
import { FaCloudDownloadAlt } from "react-icons/fa";
import EditIcon from "@mui/icons-material/Edit";
import { FaCloudUploadAlt, FaFolderMinus } from "react-icons/fa";
import { MdDelete, MdDriveFileMoveRtl } from "react-icons/md";
import { Router } from "next/router";

export const folderData = [
  {
    img: "/images/home/documentIcon.png",
    text: "Document",
  },
  {
    img: "/images/home/syncIcon.png",
    text: "Website Sync",
  },
  {
    img: "/images/home/activityIcon.png",
    text: "Recent Activity",
  },
];

export const faqData = [
  {
    question: "How do I become a member of LibriVista Library?",
    answer:
      "You can become a member by signing up on our website with your email address, phone number, and address. Choose between Free, Standard, or Premium membership plans based on your reading needs.",
  },
  {
    question: "What is the borrowing period for books?",
    answer:
      "Free members can borrow books for 7 days, Standard members for 14 days, and Premium members for 21 days. You can renew books online if no one else has reserved them.",
  },
  {
    question: "How do I reserve a book that is currently unavailable?",
    answer:
      "You can reserve books through our website by clicking the 'Reserve' button on any book. You'll receive a notification when the book becomes available for pickup.",
  },
  {
    question: "What are the late return fees?",
    answer:
      "Late fees are Rs. 10 per day for Free members, Rs. 7 per day for Standard members, and Rs. 5 per day for Premium members. Fees are calculated from the due date until the return date.",
  },
];
export const chatData = [
  {
    date: "Nov 26, 2020",
    othersText: "It is a long established fact  will be looking at its layout.",
    selfText: "It is a long established fact estabildsgs ive",
    otherImage: "/images/home/otherProfile.jpg",
  },
  {
    date: "Nov 26, 2020",
    othersText: "It is a long established fact  will be looking at its layout.",
    selfText: "It is a long established fact estabildsgs ive",
    otherImage: "/images/home/otherProfile.jpg",
  },
];

export const uploadDocumentModalData = [
  {
    uploadImage: "/images/home/galleryImg.jpg",
    name: "Photos",
  },
  {
    uploadImage: "/images/home/cameraImg.png",
    name: "Camera",
  },
];
export const ShortModalData = [
  {
    name: "Sort: A-Z",
  },
  {
    name: "Sort: Newest- Oldest",
  },
  {
    name: "List View",
  },
  {
    name: "Only Photo",
  },
  {
    name: "Only Folder",
  },
];
