import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { db } from "../../lib/firebase";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";
import { collection, getDocs, onSnapshot } from "@firebase/firestore";
import { SearchTextInput } from "../../Components/Form/Inputs";
import Title from "../../Components/Form/Title";
import Alert from "../../Components/Alerts";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableCell,
  TableRow,
  Pagination,
  Switch,
  Modal,
  Button,
  Spinner,
  getKeyValue,
} from "@nextui-org/react";
const UserList = () => {
  //filter states
  const [searchInput, setSearchInput] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [userListData, setUserListData] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [paginatedList, setPaginatedList] = useState([]);

  //validating if user is signed in
  const { user, setErrors, errors } = useAuth();
  const router = useRouter();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const ROWS_PER_PAGE = 10;
  useEffect(() => {
    setErrors({});
    // if (!user) {
    //   router.push("/auth/Login");
    // } else if (localUser.role != "ADMINISTRADOR") {
    //   setErrors("");
    //   router.push("/");
    // }
    const userRef = collection(db, "users");
    const unsubscribe = onSnapshot(userRef, (querySnapshot) => {
      const updatedData = querySnapshot.docs.map((doc) => doc.data());
      //get the amount total amount of pages
      setTotalPages(Math.ceil(updatedData.length / ROWS_PER_PAGE));
      setPaginatedList(updatedData.slice(0, ROWS_PER_PAGE));
      setUserListData(updatedData);
      return () => unsubscribe();
    });
  }, []);
  //for search input
  useEffect(() => {
    if (userListData && searchInput) {
      const foundUsers = userListData.filter((obj) =>
        obj.email.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSearchResults(foundUsers);
    } else {
      setSearchResults([]);
    }
  }, [userListData, searchInput]);

  const handlePaginationChange = (currentPage) => {
    setPage(currentPage);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const newArray = userListData.slice(startIndex, endIndex);
    setPaginatedList(newArray);
  };
  //switch between active and inactive users
  return (
    <div className="list-wrapper">
      <Head>
        <title>Lista de Usuarios | Liga Contra el Cancér</title>
        <meta name="description" content="lista de usuarios" />
      </Head>
      {/* notifications */}
      {router.query.status == 1 && (
        <Alert
          title={"Éxito"}
          message={"La operación fue realizada"}
          type={"success"}
        />
      )}
      {router.query.status == 0 && (
        <Alert
          title={"Error"}
          message={"Hubo un problema realizando la operación"}
          type={"danger"}
        />
      )}
      <div>
        <div>
          <div>
            <Title>Administración de Usuarios</Title>
          </div>
        </div>
        {/* filters */}
        <div className="top-list-section">
          <SearchTextInput
            label={"Correo Electrónico"}
            value={searchInput}
            setValue={setSearchInput}
            type="text"
            placeholder={"Buscar por correo..."}
          />
          <Switch
            className="margin-switch"
            color="primary"
            onValueChange={setShowInactive}
            isSelected={showInactive}
          >
            {showInactive ? "Mostrar inactivos" : "Mostrar activos"}
          </Switch>
        </div>
        <Link href={"/users/UserRegister"}>
          <Image
            className="btn-add-patient"
            src={"/icons/add.png"}
            width={50}
            height={50}
            alt="add icon"
          />
        </Link>
        <Table
          className="margin-table"
          lined
          headerLined
          align="center"
          shadow={false}
          aria-label="Example static collection table"
          bottomContent={
            totalPages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={totalPages}
                  onChange={(page) => handlePaginationChange(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn css={{ fontSize: "$sm", width: "50%" }}>
              Correo Electrónico
            </TableColumn>
            <TableColumn css={{ fontSize: "$sm", maxWidth: "20%" }}>
              Nombre
            </TableColumn>
            <TableColumn css={{ fontSize: "$sm", width: "10%" }}>
              Estado
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay usuarios registrados">
            {searchResults && searchInput
              ? searchResults.map((item, key) => (
                  <TableRow key={key}>
                    <TableCell css={{ fontSize: "$lg" }}>
                      <Link
                        href={`/users/${item.user_code}`}
                        className="row-name"
                      >
                        {item.email}
                      </Link>
                    </TableCell>
                    <TableCell css={{ textAlign: "left" }}>
                      {`${item.firstName[0]}. ${item.lastName}`}
                    </TableCell>
                    <TableCell>
                      <Image
                        src={
                          item.user_state === "ACTIVO"
                            ? "/icons/user-check-blue.svg"
                            : "/icons/user-xmark-orange.svg"
                        }
                        width={20}
                        height={20}
                        alt="user check"
                      />
                    </TableCell>
                  </TableRow>
                ))
              : paginatedList &&
                paginatedList.map((item, key) => {
                  if (item.user_state != "INACTIVO") {
                    return (
                      <TableRow key={key}>
                        <TableCell css={{ fontSize: "$lg" }}>
                          <Link
                            href={`/users/${item.user_code}`}
                            className="row-name"
                          >
                            {item.email}
                          </Link>
                        </TableCell>
                        <TableCell css={{ textAlign: "left" }}>
                          {`${item.firstName[0]}. ${item.lastName}`}
                        </TableCell>
                        <TableCell>
                          <Image
                            src={"/icons/user-check-blue.svg"}
                            width={20}
                            height={20}
                            alt="user check"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  } else if (showInactive) {
                    return (
                      <TableRow key={key}>
                        <TableCell css={{ fontSize: "$lg" }}>
                          <Link
                            href={`/users/${item.user_code}`}
                            className="row-name"
                          >
                            {item.email}
                          </Link>
                        </TableCell>
                        <TableCell
                          css={{ textAlign: "left" }}
                        >{`${item.firstName[0]}. ${item.lastName}`}</TableCell>
                        <TableCell>
                          <Image
                            className="table-actions"
                            src={"/icons/user-xmark-orange.svg"}
                            width={20}
                            height={20}
                            alt="user xmark"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  }
                })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const querySnapshot = await getDocs(collection(db, "users"));
  const data = querySnapshot.docs.map((doc) => {
    const item = doc.data();
    return item;
  });
  return {
    props: {
      data,
    },
    revalidate: 1,
  };
}

export default UserList;
