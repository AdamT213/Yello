import Head from "next/head";

export default ({ children }) => (
  <div>
    <Head>
      <link
        href="https://fonts.googleapis.com/css?family=Pacifico"
        rel="stylesheet"
      />
    </Head>
    <main>
      {children}
      <style jsx global>{`
        * {
          font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono",
            "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New",
            monospace, serif;
        }
        body {
          text-align: center;
          margin: 0;
          padding: 0;
        }
        h1#cursive {
          fontfamily: "Pacifico", cursive;
        }

        button {
          font-weight: 500;
          color: #fff;
          background-color: rgb(240, 210, 75);
          padding: 0.25rem 0.5rem;
          font-size: 1.09375rem;
          line-height: 1.5;
          border-radius: 0.2rem;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          border: 1px solid transparent;
          cursor: pointer;
        }

        a:visited {
          color: blue;
        }
        a:hover {
          color: rgb(240, 210, 75);
        }
      `}</style>
    </main>
  </div>
);
