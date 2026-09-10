import { useCallback, useEffect, useRef, useState } from "react";
import { FrssModeler } from "freas-bpmn4frss-library";

// import all necessary CSS (built in assets/bpmn4frss-editor.css)
import "../assets/index.css";

// import components
import { FileInputButton } from "./FileInputButton";
import { ButtonContainer } from "./ButtonContainer";
import { Button } from "./Button";
import { ValidationForm } from "./ValidationForm";

// import utility functions
import { loadDiagramFromFile } from "../utils/loadDiagramFromFile";
import { donwloadDiagramAsXML } from "../utils/downloadXML";
import { downloadDiagramAsSVG } from "../utils/downloadSVG";

// import bpmn extensions and fixes
import createDataStoreBehavior from "../bpmn-extensions";

export type Bpmn4FrssModelerProps = {
  className?: string,
};

/**
 * Component encapsulating the freas-bpmn4frss-library
 *
 * @returns JSX (TSX) element
 */
const Bpmn4FrssModeler: React.FC<Bpmn4FrssModelerProps> = (
  {className}
) => {
  // create a reference to mount the library to the rendered element
  const container = useRef<HTMLDivElement>(null);

  // create a reference to mount the properties panel onto
  const propertiesContainer = useRef<HTMLDivElement>(null);

  // create a reference so mounting and unmounting happens only once
  const initializeLibrary = useRef(true);

  // create a state for the Bpmn4FrssWebEditor
  const [library, setLibrary] = useState<FrssModeler>();

  // diagram state triggering remounting of the validation form panel
  const [diagram, setDiagram] = useState<string | undefined>();

  // state for the panel (triggering a redraw)
  const [panelState, setPanelState] = useState<boolean>(true);
  const downloadFileStore = useRef<string | undefined>();

  // allow running resize on window resize
  const resizer = useCallback(() => {
    library?.resize();
  }, [library]);

  // mounting the library
  useEffect(() => {
    // mounting the library only once
    if (initializeLibrary.current) {
      // the library is held as a state
      // (to rerender the view once it is loaded)
      setLibrary(
        new FrssModeler({
          container: container.current ?? undefined,
          propertiesPanel: {
            parent: propertiesContainer.current ?? undefined
          },
          additionalModules: [
            createDataStoreBehavior
          ]
        })
      );
      initializeLibrary.current = false;
    }

    // clean up function (destructor)
    return () => {
      if (!initializeLibrary.current) {
        window.removeEventListener('resize', resizer);
        library?.destroy();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // loading the default diagram on start
  useEffect(() => {
    const diagram = library?.loadDefaultDiagram();

    // add an event listener to listen for resize events
    window.addEventListener('resize', resizer);

    // trigger rerender after the diagram has been loaded
    diagram?.then((newDiagram) => setDiagram(newDiagram));

    return () => {
      window.removeEventListener('resize', resizer);
    }
  }, [library, resizer]);

  return (
    <div className={`bpmn4frss ${className ?? ''}`}>
      <div className="editor-container">
        {/* Bpmn4Frss TypeScript library */}
        <div ref={container} className="editor"></div>
        {/* Control buttons */}
        <ButtonContainer>
            <FileInputButton 
              onChange={loadDiagramFromFile}
              library={library}
              caption="Load diagram"
              setDiagram={setDiagram}
            />
            <Button 
              caption="Default diagram"
              onClick={async () => {
                const newDiagram = await library?.loadDefaultDiagram();
                setDiagram(newDiagram);
              }}
            />
            <Button 
              caption="Demo diagram"
              onClick={async () => {
                const newDiagram = await library?.loadDemoDiagram();
                setDiagram(newDiagram);
              }}
            />
            <Button 
              caption="Download XML"
              onClick={
                async () => (
                  donwloadDiagramAsXML(
                    downloadFileStore,
                    await library?.saveXML()
                  )
                )
              }
            />
            <Button 
              caption="Download SVG"
              onClick={
                async () => (
                  downloadDiagramAsSVG(
                    downloadFileStore,
                    await library?.saveSVG()
                  )
                )
              }
            />
            <Button 
              caption={panelState ? 'Show validation' : 'Show properties'}
              onClick={() => setPanelState((prev) => !prev)}
            />
        </ButtonContainer>
      </div>
      
      {/* Properties panel */}
      <div 
        ref={propertiesContainer} 
        className={`properties${panelState ? ' visible' : ''}`}
      ></div>

      {!panelState && 
        /* Validation form panel */
        <ValidationForm
          className={'validation visible'}
          library={library}
          diagram={diagram}
        />
      }
    </div>
  );
};

export default Bpmn4FrssModeler;
