export default ({ children }) => (
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
      a:visited {
        color: blue;
      }
    `}</style>
  </main>
);
