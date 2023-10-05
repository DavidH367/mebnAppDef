import Head from "next/head";
import { useRouter } from "next/router";
import { Button} from "@nextui-org/react";
const Custom404 = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>404 - No encontrado</title>
      </Head>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          flexDirection: "column",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            width: "70%",
          }}
        >
          <h1
            style={{
              fontSize: "6rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            404
          </h1>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "2rem",
            }}
          >
            Página no Encontrada
          </p>
          <p
            style={{
              fontSize: "1rem",
              fontWeight: "normal",
            }}
          >
            La página que estás buscando podría haber sido eliminada o estar
            temporalmente no disponible.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              ghost
              color={"primary"}
              size={"lg"}
              onClick={() => {
                router.back();
              }}
            >
              Regresar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404;
