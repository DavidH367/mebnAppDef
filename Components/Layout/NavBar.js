import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/context/AuthContext";
import {
  Avatar,
  Dropdown,
  Navbar as NextUINavbar,
  Text,
  Link,
  Button,
  Modal,
} from "@nextui-org/react";