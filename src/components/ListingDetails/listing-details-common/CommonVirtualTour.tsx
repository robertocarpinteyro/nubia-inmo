"use client"
import { useEffect, useRef } from "react";
import "@photo-sphere-viewer/core/index.css";

interface Props {
  panoramaUrl: string;
  height?: string;
}

const CommonVirtualTour = ({ panoramaUrl, height = "500px" }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let viewer: any;

    const initViewer = async () => {
      const { Viewer } = await import("@photo-sphere-viewer/core");

      viewer = new Viewer({
        container: containerRef.current!,
        panorama: panoramaUrl,
        defaultZoomLvl: 0,
        navbar: ["zoom", "fullscreen"],
        lang: {
          zoom: "Zoom",
          zoomOut: "Alejar",
          zoomIn: "Acercar",
          fullscreen: "Pantalla completa",
          enterFullscreen: "Pantalla completa",
          exitFullscreen: "Salir de pantalla completa",
          download: "Descargar",
          menu: "Menú",
          close: "Cerrar",
          twoFingers: "Usa dos dedos para navegar",
          ctrlZoom: "Usa Ctrl + scroll para hacer zoom",
          loadError: "No se pudo cargar el panorama",
        },
      });

      viewerRef.current = viewer;
    };

    initViewer();

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [panoramaUrl]);

  return (
    <div className="bg-white shadow4 border-20 p-15 mb-50">
      <h4 className="mb-20 px-25 pt-25">Tour Virtual 360°</h4>
      <div
        ref={containerRef}
        style={{ width: "100%", height, borderRadius: "12px", overflow: "hidden" }}
      />
    </div>
  );
};

export default CommonVirtualTour;
