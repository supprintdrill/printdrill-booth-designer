import React, { useEffect, useMemo, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import {
  Stage,
  Layer,
  Rect,
  Line,
  Text,
  Group,
  Circle,
  Image as KonvaImage,
} from "react-konva";
import "./App.css";
import { supabase } from "./supabaseClient";

const SAMPLE_PRODUCTS = [
{
  id: "p1",
  name: "Stretch Fabric Display",
  placementRole: "wall_display",
  color: "#4B35FD",
  category: "Backdrops",
  keywords: "fabric backdrop trade show display wall",
  productUrl: "https://www.printdrill.com/products/straight-pillow-case-tension-fabric-backdrop",

  attributes: [
    {
      label: "8ft",
      widthFt: 8,
      depthFt: 1.8,
      heightFt: 8,
      price: 120,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/TensionFabricDisplays.jpg?v=1774958399",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/10x8-Straight_Pillow_Case_Tension_Fabric_Display.png?v=1778893683",
    },
    {
      label: "10ft",
      widthFt: 10,
      depthFt: 1.8,
      heightFt: 8,
      price: 420,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/TensionFabricDisplays.jpg?v=1774958399",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/10x8-Straight_Pillow_Case_Tension_Fabric_Display.png?v=1778893683",
    },
    {
      label: "20ft",
      widthFt: 20,
      depthFt: 1.8,
      heightFt: 8,
      price: 420,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/TensionFabricDisplays.jpg?v=1774958399",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/20x8-Straight_Pillow_Case_Tension_Fabric_Display.png?v=1778893683",
    },
  ],

  // fallback only
  width: 10,
  height: 1.8,
  price: 120,
  productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/TensionFabricDisplays.jpg?v=1774958399",
  canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/10x8-Straight_Pillow_Case_Tension_Fabric_Display.png?v=1778893683",
},

{
  id: "p6",
  name: "Adjustable Banner Stand",
  placementRole: "wall_display",
  color: "#4B35FD",
  category: "Backdrops",
  keywords: "banner stand backdrop trade show display wall",
  productUrl: "https://www.printdrill.com/products/step-and-repeat-banner-stand",

  attributes: [
    {
      label: "8ft",
      widthFt: 8,
      depthFt: 1.8,
      heightFt: 8,
      price: 120,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Step_and_Repeat_Frame-min.jpg?v=1773109039",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8x8-Adjustable_Banner_Stand.png?v=1778903180",
    },
    {
      label: "10ft",
      widthFt: 10,
      depthFt: 1.8,
      heightFt: 8,
      price: 420,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Step_and_Repeat_Frame-min.jpg?v=1773109039",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/10x8-Adjustable_Banner_Stand.png?v=1778903180",
    },
  ],

  // fallback only
  width: 10,
  height: 1.8,
  price: 120,
  productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Step_and_Repeat_Frame-min.jpg?v=1773109039",
  canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8x8-Adjustable_Banner_Stand.png?v=1778903180",
},

{
  id: "p3",
  name: "Full Printed Table Cover Throws",
  placementRole: "visitor_facing",
  color: "#4B35FD",
  category: "Tables & Counters",
  keywords: "trade show table cover",
  productUrl: "https://www.printdrill.com/products/trade-show-printed-table-cover-throws",

  attributes: [
    {
      label: "4ft",
      widthFt: 4,
      depthFt: 2.6,
      heightFt: 2.5,
      price: 99,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Full_Color_Print_Table_Cover_Throws-min.jpg?v=1768183309",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/4ft-_Table_Cover-2.png?v=1779067063",
    },
    {
      label: "6ft",
      widthFt: 6,
      depthFt: 2.6,
      heightFt: 2.5,
      price: 123,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Full_Color_Print_Table_Cover_Throws-min.jpg?v=1768183309",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/6ft_-_Table_Cover-2.png?v=1779067063",
    },
    {
      label: "8ft",
      widthFt: 8,
      depthFt: 2.6,
      heightFt: 2.5,
      price: 144,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Full_Color_Print_Table_Cover_Throws-min.jpg?v=1768183309",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8ft_-_Table_Cover-2.png?v=1779067063",
    },
  ],

  // fallback only
  width: 6,
  height: 2.6,
  price: 123,
  productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Full_Color_Print_Table_Cover_Throws-min.jpg?v=1768183309",
  canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/6ft_-_Table_Cover-2.png?v=1779067063",
},
{
  id: "p4",
  name: "Deluxe Popup Counter",
  placementRole: "wall_display",
  color: "#4B35FD",
  category: "Tables & Counters",
  keywords: "Counter table",
  productUrl: "https://www.printdrill.com/products/deluxe-popup-counter",

  attributes: [
    {
      label: "2.6ft x 1.6 ft",
      widthFt: 2.6,
      depthFt: 1.6,
      heightFt: 3.2,
      price: 299,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Deluxe_Popup_Counter-1-min.jpg?v=1764447977",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Deluxe_Popup_Counter.png?v=1778975857",
    },
  ],

  // fallback only
  width: 2.6,
  height: 1.6,
  price: 299,
  productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Deluxe_Popup_Counter-1-min.jpg?v=1764447977",
  canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Deluxe_Popup_Counter.png?v=1778975857",
},
  {
    id: "p5",
    name: "SEG LightBox Display",
    width: 6,
    height: 1,
    dimensions: {
      widthFt: 6,
      depthFt: 1,
      heightFt: 8,
    },
    image:
  "https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=1200&auto=format&fit=crop",
    color: "#DFDAFF",
    price: 220,
    category: "Lightboxes",
    keywords: "seg lightbox backlit display led booth",
    productImage:
      "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/SEG_LightBox_Display_-_10_ft-min.jpg?v=1765745552",
    canvasImage:
      "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/SEG_LightBox_Display_-_13_ft_x_7.4_ft_Size-min.jpg?v=1765816106",

    requiresProductId: "p1",
  },

{
  id: "p8",
  name: "Straight Pop Up Display",
  placementRole: "wall_display",
  color: "#4B35FD",
  category: "Backdrops",
  keywords: "Fabric Pop Up Straight Display backdrop",
  productUrl: "https://www.printdrill.com/products/step-and-repeat-fabric-pop-up-straight-display",

  attributes: [
    {
      label: "7.5ft",
      widthFt: 7.5,
      depthFt: 1.1,
      heightFt: 7.5,
      price: 485,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8_ft_Straignt_Popup_Display_Side.jpg?v=1776879183",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/7.5_ft_Straight_Pop_Up_Display-2.png?v=1779071127",
    },
    {
      label: "10ft",
      widthFt: 10,
      depthFt: 1.1,
      heightFt: 7.5,
      price: 590,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8_ft_Straignt_Popup_Display_Side.jpg?v=1776879183",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/10_ft_Straight_Pop_Up_Display-2.png?v=1779071127",
    },
    {
      label: "10ft",
      widthFt: 10,
      depthFt: 1.1,
      heightFt: 10,
      price: 663,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8_ft_Straignt_Popup_Display_Side.jpg?v=1776879183",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/10_ft_Straight_Pop_Up_Display-2.png?v=1779071127",
    },
    {
      label: "15ft",
      widthFt: 15,
      depthFt: 1.1,
      heightFt: 7.5,
      price: 793,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8_ft_Straignt_Popup_Display_Side.jpg?v=1776879183",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/15_ft_Straight_Pop_Up_Display-2.png?v=1779071127",
    },
    {
      label: "15ft",
      widthFt: 15,
      depthFt: 1.1,
      heightFt: 10,
      price: 986,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8_ft_Straignt_Popup_Display_Side.jpg?v=1776879183",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/15_ft_Straight_Pop_Up_Display-2.png?v=1779071127",
    },
    {
      label: "20ft",
      widthFt: 20,
      depthFt: 1.1,
      heightFt: 7.5,
      price: 999,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8_ft_Straignt_Popup_Display_Side.jpg?v=1776879183",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/20_ft_Straight_Pop_Up_Display-2.png?v=1779071127",
    },
    {
      label: "20ft",
      widthFt: 20,
      depthFt: 1.1,
      heightFt: 10,
      price: 1215,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8_ft_Straignt_Popup_Display_Side.jpg?v=1776879183",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/20_ft_Straight_Pop_Up_Display-2.png?v=1779071127",
    },
  ],

  // fallback only
  width: 10,
  height: 7.5,
  price: 590,
  productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8_ft_Straignt_Popup_Display_Side.jpg?v=1776879183",
  canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/10_ft_Straight_Pop_Up_Display-2.png?v=1779071127",
},

  
  {
  id: "p7",
  name: "Stretch Fit Table Cover",
  placementRole: "wall_display",
  color: "#4B35FD",
  category: "Tables & Counters",
  keywords: "stretch fit table cover",
  productUrl: "https://www.printdrill.com/products/stretch-table-covers-with-open-back",

  attributes: [
    {
      label: "4ft",
      widthFt: 4,
      depthFt: 2.6,
      heightFt: 2.8,
      price: 114,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Stretch_Table_Cover_with_Open_Back_Side_View-min.jpg?v=1767810452",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/4ft_Stretch_Fit_Table_Cover-2.png?v=1778934635",
    },
    {
      label: "6ft",
      widthFt: 6,
      depthFt: 2.6,
      heightFt: 2.8,
      price: 127,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Stretch_Table_Cover_with_Open_Back_Side_View-min.jpg?v=1767810452",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/6ft_Stretch_Fit_Table_Cover-2.png?v=1778934755",
    },
    {
      label: "8ft",
      widthFt: 8,
      depthFt: 2.6,
      heightFt: 2.8,
      price: 137,
      productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Stretch_Table_Cover_with_Open_Back_Side_View-min.jpg?v=1767810452",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/8ft_Stretch_Fit_Table_Cover-2.png?v=1778934774",
    },
  ],

  // fallback only
  width: 6,
  height: 2.6,
  price: 127,
  productImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/Stretch_Table_Cover_with_Open_Back_Side_View-min.jpg?v=1767810452",
      canvasImage: "https://cdn.shopify.com/s/files/1/0606/7034/5293/files/6ft_Stretch_Fit_Table_Cover-2.png?v=1778934755",
},
];

const ACCESSORIES = [
  { id: "a1", name: "Carry Bag", price: 25 },
  { id: "a2", name: "Extra Lights", price: 45 },
  { id: "a3", name: "Booth Clips", price: 15 },
];

const BOOTH_SIZES = [
  { label: "10 x 10", width: 10, height: 10 },
  { label: "10 x 15", width: 10, height: 15 },
  { label: "10 x 20", width: 10, height: 20 },
  { label: "20 x 20", width: 20, height: 20 },
];

const BOOTH_TYPES = ["Not Specified", "Inline", "Corner", "Peninsula", "Island"];
const ADJACENT_TYPES = ["Aisle", "Wall", "Other Booth"];

const BOOTH_TYPE_PRESETS = {
  "Not Specified": {
    top: "Aisle",
    right: "Aisle",
    bottom: "Aisle",
    left: "Aisle",
  },
  Inline: {
    top: "Wall",
    right: "Other Booth",
    bottom: "Aisle",
    left: "Other Booth",
  },
  Corner: {
    top: "Wall",
    right: "Aisle",
    bottom: "Aisle",
    left: "Wall",
  },
  Peninsula: {
    top: "Wall",
    right: "Aisle",
    bottom: "Aisle",
    left: "Aisle",
  },
  Island: {
    top: "Aisle",
    right: "Aisle",
    bottom: "Aisle",
    left: "Aisle",
  },
};

const ADJACENT_COLORS = {
  Aisle: "#dcfce7",
  Wall: "#fee2e2",
  "Other Booth": "#e0e7ff",
};

const FEET_TO_PIXEL = 40;
const RULER_SIZE = 34;
const OUTER_PADDING = 80;
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 1.08;
const SNAP_THRESHOLD = 10;
const OUTER_CANVAS_FT = 30;

const useImageElement = (src) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!src) return;

    const img = new window.Image();

    img.crossOrigin = "Anonymous";

    img.src = src;

    img.onload = () => {
      setImage(img);
    };
  }, [src]);

  return image;
};

  
function BoothProduct({
  item,
  size,
  isSelected,
  invalidItemId,
  hasClearanceWarning,
}) {
  const widthFt = item.dimensions?.widthFt ?? item.width ?? 1;
  const depthFt = item.dimensions?.depthFt ?? item.height ?? 1;

  const image = useImageElement(item.canvasImage);

  return (
    <>
      <Rect
        width={size.width}
        height={size.height}
        fill={
                invalidItemId === item.instanceId
                  ? "#fee2e2"
                  : image
                  ? "rgba(255,255,255,0)"
                  : "#f8fafc"
              }
        stroke={invalidItemId === item.instanceId ? "#ef4444" : item.color}
        strokeWidth={2}
        cornerRadius={6}
        opacity={item.locked ? 0.65 : 1}
        shadowColor="rgba(15, 23, 42, 0.16)"
        shadowBlur={8}
        shadowOffset={{ x: 0, y: 4 }}
        shadowOpacity={image ? 0 : 0.3}
      />

      {image ? (
        <KonvaImage
          image={image}
          x={size.width / 2}
          y={size.height / 2}
          width={Math.abs((item.rotation || 0) % 180) === 90 ? size.height : size.width}
          height={Math.abs((item.rotation || 0) % 180) === 90 ? size.width : size.height}
          offsetX={
            (Math.abs((item.rotation || 0) % 180) === 90 ? size.height : size.width) / 2
          }
          offsetY={
            (Math.abs((item.rotation || 0) % 180) === 90 ? size.width : size.height) / 2
          }
          rotation={item.rotation || 0}
          cornerRadius={6}
          opacity={item.locked ? 0.65 : 1}
        />
      ) : (
        <>
          <Text
            text={item.name}
            x={6}
            y={8}
            fontSize={11}
            fill="#111827"
            fontStyle="bold"
            width={size.width - 12}
          />

          <Text
            text={`${widthFt}ft x ${depthFt}ft`}
            x={6}
            y={size.height - 20}
            fontSize={10}
            fill="#6b7280"
            width={size.width - 12}
          />
        </>
      )}

      {hasClearanceWarning && (
        <Rect
          x={-3}
          y={-3}
          width={size.width + 6}
          height={size.height + 6}
          stroke="#f97316"
          strokeWidth={3}
          dash={[8, 5]}
          cornerRadius={8}
        />
      )}

      {item.locked && (
        <Text
          text="🔒"
          x={size.width - 22}
          y={6}
          fontSize={14}
          fill="#111827"
        />
      )}

      {isSelected && (
        <>
          <Rect
            x={-4}
            y={-4}
            width={size.width + 8}
            height={size.height + 8}
            stroke="#0169f5"
            strokeWidth={2}
            dash={[6, 4]}
          />

          <Circle x={0} y={0} radius={5} fill="#0169f5" />
          <Circle x={size.width} y={0} radius={5} fill="#0169f5" />
          <Circle x={0} y={size.height} radius={5} fill="#0169f5" />
          <Circle x={size.width} y={size.height} radius={5} fill="#0169f5" />
        </>
      )}
    </>
  );
}


function App() {
  const [selectedBooth, setSelectedBooth] = useState(BOOTH_SIZES[0]);
  const [zoom, setZoom] = useState(1);
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [canvasTool, setCanvasTool] = useState("select");
  const [showFlowHeatmap, setShowFlowHeatmap] = useState(false);
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [message, setMessage] = useState("");
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [accessoryQty, setAccessoryQty] = useState({});
  const [savedDesigns, setSavedDesigns] = useState(() => {
    return JSON.parse(localStorage.getItem("boothDesigns") || "[]");
  });
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [isSmallScreen, setIsSmallScreen] = useState(
  window.innerWidth < 1100
  );
  const [onlineSaveUrl, setOnlineSaveUrl] = useState("");
  const [onlineSaving, setOnlineSaving] = useState(false);
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const [loadedFromSupabase, setLoadedFromSupabase] = useState(false);
  const [finalWindowOpen, setFinalWindowOpen] = useState(false);
  const [boothType, setBoothType] = useState("Not Specified");
  const [adjacentAreas, setAdjacentAreas] = useState(
    BOOTH_TYPE_PRESETS["Not Specified"]
  );
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductAttributes, setSelectedProductAttributes] = useState({});
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const stageRef = useRef(null);
  const finalContentRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const [layoutSnapshot, setLayoutSnapshot] = useState("");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [invalidItemId, setInvalidItemId] = useState(null);
  const [alignmentGuides, setAlignmentGuides] = useState([]);
  const [spacingGuides, setSpacingGuides] = useState([]);
  const [selectionBox, setSelectionBox] = useState(null);
  const previousBoothOriginRef = useRef(null);
  const panStartRef = useRef(null);
  const groupDragStartRef = useRef(null);
  const selectionStartRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({
    width: 900,
    height: 650,
  });

  const boothPixelWidth = selectedBooth.width * FEET_TO_PIXEL;
  const boothPixelHeight = selectedBooth.height * FEET_TO_PIXEL;

  const outerCanvasPaddingPx = OUTER_CANVAS_FT * FEET_TO_PIXEL;

  const stageWidth = Math.max(
    canvasSize.width,
    boothPixelWidth + outerCanvasPaddingPx * 2
  );

  const stageHeight = Math.max(
    canvasSize.height,
    boothPixelHeight + outerCanvasPaddingPx * 2
  );

  const boothX = outerCanvasPaddingPx;
  const boothY = outerCanvasPaddingPx;

  const ADJACENT_BAR_WIDTH = 34;
  const ADJACENT_GAP = 10;

  const activeCanvasTool = isSpacePressed ? "pan" : canvasTool;
  const selectedItem = items.find((item) => item.instanceId === selectedItemId);

  const selectedItems = items.filter((item) =>
    selectedItemIds.includes(item.instanceId)
  );

const hasMultiSelection = selectedItemIds.length > 1;
  const getPointerInCanvas = () => {
    const stage = stageRef.current;

    if (!stage) return null;

    const pointer = stage.getPointerPosition();

    if (!pointer) return null;

    return {
      x: (pointer.x - canvasPan.x) / zoom,
      y: (pointer.y - canvasPan.y) / zoom,
    };
  };


  const handleCanvasMouseDown = (e) => {
    const stage = e.target.getStage();

    const clickedOnStage = e.target === stage;
    const clickedOnBackground = e.target.name() === "canvas-background";

    if (!clickedOnStage && !clickedOnBackground) return;

    if (activeCanvasTool === "pan") {
      setSelectedItemId(null);
      setSelectedItemIds([]);
      setIsPanning(true);

      panStartRef.current = {
        pointer: stage.getPointerPosition(),
        pan: canvasPan,
      };

      return;
    }

    const pointer = getPointerInCanvas();

    if (!pointer) return;

    const isMultiSelect = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;

    if (!isMultiSelect) {
      clearSelection();
    }

    selectionStartRef.current = {
      x: pointer.x,
      y: pointer.y,
      additive: isMultiSelect,
    };

    setSelectionBox({
      x: pointer.x,
      y: pointer.y,
      width: 0,
      height: 0,
    });

    setIsPanning(false);
  };

  const handleCanvasMouseMove = () => {
    if (isPanning && panStartRef.current) {
      const stage = stageRef.current;
      const pointer = stage?.getPointerPosition();

      if (!pointer || !panStartRef.current.pointer) return;

      const dx = pointer.x - panStartRef.current.pointer.x;
      const dy = pointer.y - panStartRef.current.pointer.y;

      setCanvasPan({
        x: panStartRef.current.pan.x + dx,
        y: panStartRef.current.pan.y + dy,
      });

      return;
    }

    if (!selectionStartRef.current) return;

    const pointer = getPointerInCanvas();

    if (!pointer) return;

    const start = selectionStartRef.current;

    setSelectionBox({
      x: Math.min(start.x, pointer.x),
      y: Math.min(start.y, pointer.y),
      width: Math.abs(pointer.x - start.x),
      height: Math.abs(pointer.y - start.y),
    });
  };

 const handleCanvasMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
      return;
    }

    if (!selectionStartRef.current || !selectionBox) {
      setSelectionBox(null);
      selectionStartRef.current = null;
      return;
    }

    const box = selectionBox;

    const selectedInBox = items.filter((item) => {
      const size = getItemPixelSize(item);

      const itemLeft = item.x;
      const itemRight = item.x + size.width;
      const itemTop = item.y;
      const itemBottom = item.y + size.height;

      const boxLeft = box.x;
      const boxRight = box.x + box.width;
      const boxTop = box.y;
      const boxBottom = box.y + box.height;

      return (
        itemLeft >= boxLeft &&
        itemRight <= boxRight &&
        itemTop >= boxTop &&
        itemBottom <= boxBottom
      );
    });

    const selectedIds = selectedInBox.map((item) => item.instanceId);

    if (selectionStartRef.current.additive) {
      setSelectedItemIds((prev) => {
        const merged = Array.from(new Set([...prev, ...selectedIds]));
        setSelectedItemId(merged[merged.length - 1] || null);
        return merged;
      });
    } else {
      setSelectedItemIds(selectedIds);
      setSelectedItemId(selectedIds[selectedIds.length - 1] || null);
    }

    setSelectionBox(null);
    selectionStartRef.current = null;
    setIsPanning(false);
    panStartRef.current = null;
  };

  const handleWheelZoom = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current;

    if (!stage) return;

    const oldScale = zoom;

    const pointer = stage.getPointerPosition();

    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - canvasPan.x) / oldScale,
      y: (pointer.y - canvasPan.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;

    let newScale =
      direction > 0 ? oldScale * ZOOM_STEP : oldScale / ZOOM_STEP;

    newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale));

    const newPan = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setZoom(newScale);
    setCanvasPan(newPan);
  };

    const getSmartFitZoom = () => {
      if (!canvasSize.width || !canvasSize.height) {
        return 1;
      }

      const visiblePaddingX = 120;
      const visiblePaddingY = 110;

      const availableWidth = Math.max(300, canvasSize.width - visiblePaddingX);
      const availableHeight = Math.max(300, canvasSize.height - visiblePaddingY);

      const fitZoomX = availableWidth / boothPixelWidth;
      const fitZoomY = availableHeight / boothPixelHeight;

      const fitZoom = Math.min(fitZoomX, fitZoomY);

      return Math.max(
        MIN_ZOOM,
        Math.min(fitZoom, 1.75)
      );
    };

    const getCenteredCanvasPan = (targetZoom = zoom) => {
      if (!canvasSize.width || !canvasSize.height) {
        return { x: 0, y: 0 };
      }

      const boothCenterX = boothX + boothPixelWidth / 2;
      const boothCenterY = boothY + boothPixelHeight / 2;

      return {
        x: canvasSize.width / 2 - boothCenterX * targetZoom,
        y: canvasSize.height / 2 - boothCenterY * targetZoom,
      };
    };

    const fitBoothToView = () => {
      if (!canvasSize.width || !canvasSize.height) return;

      const visiblePaddingX = 140;
      const visiblePaddingY = 130;

      const availableWidth = Math.max(300, canvasSize.width - visiblePaddingX);
      const availableHeight = Math.max(300, canvasSize.height - visiblePaddingY);

      const fitZoomX = availableWidth / boothPixelWidth;
      const fitZoomY = availableHeight / boothPixelHeight;

      const nextZoom = Math.max(
        MIN_ZOOM,
        Math.min(fitZoomX, fitZoomY, MAX_ZOOM, 1.65)
      );

      const boothCenterX = boothX + boothPixelWidth / 2;
      const boothCenterY = boothY + boothPixelHeight / 2;

      const nextPan = {
        x: canvasSize.width / 2 - boothCenterX * nextZoom,
        y: canvasSize.height / 2 - boothCenterY * nextZoom,
      };

      setZoom(nextZoom);
      setCanvasPan(nextPan);
    };

    const handleResetView = () => {
      fitBoothToView();
    };

    const handleSelectItem = (e, item) => {
      const isMultiSelect = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;

      if (isMultiSelect) {
        setSelectedItemIds((prev) => {
          if (prev.includes(item.instanceId)) {
            return prev.filter((id) => id !== item.instanceId);
          }

          return [...prev, item.instanceId];
        });

        setSelectedItemId(item.instanceId);
        return;
      }

      setSelectedItemId(item.instanceId);
      setSelectedItemIds([item.instanceId]);
    };

    const clearSelection = () => {
      setSelectedItemId(null);
      setSelectedItemIds([]);
    };



const trackEvent = (eventName, payload = {}) => {
  console.log("TRACK EVENT:", eventName, payload);

  if (window.gtag) {
    window.gtag("event", eventName, payload);
  }
};

const showMessage = (text) => {
  setMessage(text);
  setTimeout(() => setMessage(""), 2500);
};

  const snapToGrid = (value) =>
    Math.round(value / FEET_TO_PIXEL) * FEET_TO_PIXEL;

  const getItemRealDimensions = (item) => {
    const widthFt = item.dimensions?.widthFt ?? item.width ?? 1;
    const depthFt = item.dimensions?.depthFt ?? item.height ?? 1;
    const heightFt = item.dimensions?.heightFt ?? 0;

    return {
      widthFt,
      depthFt,
      heightFt,
    };
  };

const getItemPixelSize = (item) => {
  const realDimensions = getItemRealDimensions(item);
  const isRotated = Math.abs((item.rotation || 0) % 180) === 90;

  return {
    width: (isRotated ? realDimensions.depthFt : realDimensions.widthFt) * FEET_TO_PIXEL,
    height: (isRotated ? realDimensions.widthFt : realDimensions.depthFt) * FEET_TO_PIXEL,
  };
};

  const isOverlapping = (a, b) => {
    const aSize = getItemPixelSize(a);
    const bSize = getItemPixelSize(b);

    return !(
      a.x + aSize.width <= b.x ||
      a.x >= b.x + bSize.width ||
      a.y + aSize.height <= b.y ||
      a.y >= b.y + bSize.height
    );
  };


const isInsideBooth = (item) => {
  const size = getItemPixelSize(item);

  return (
    item.x >= boothX &&
    item.y >= boothY &&
    item.x + size.width <= boothX + boothPixelWidth &&
    item.y + size.height <= boothY + boothPixelHeight
  );
};

const isInsideStage = (item) => {
  const size = getItemPixelSize(item);

  return (
    item.x >= 0 &&
    item.y >= 0 &&
    item.x + size.width <= stageWidth &&
    item.y + size.height <= stageHeight
  );
};

const isPartiallyInsideBooth = (item) => {
  const size = getItemPixelSize(item);

  return !(
    item.x + size.width <= boothX ||
    item.x >= boothX + boothPixelWidth ||
    item.y + size.height <= boothY ||
    item.y >= boothY + boothPixelHeight
  );
};

const snapItemFullyInsideBooth = (item) => {
  const size = getItemPixelSize(item);

  return {
    ...item,
    x: Math.min(
      Math.max(item.x, boothX),
      boothX + boothPixelWidth - size.width
    ),
    y: Math.min(
      Math.max(item.y, boothY),
      boothY + boothPixelHeight - size.height
    ),
  };
};

const getAlignmentGuides = (movingItem, itemList = items) => {
  const guides = [];

  const movingSize = getItemPixelSize(movingItem);

  const movingLeft = movingItem.x;
  const movingRight = movingItem.x + movingSize.width;
  const movingTop = movingItem.y;
  const movingBottom = movingItem.y + movingSize.height;
  const movingCenterX = movingItem.x + movingSize.width / 2;
  const movingCenterY = movingItem.y + movingSize.height / 2;

  let snappedX = movingItem.x;
  let snappedY = movingItem.y;

  itemList.forEach((other) => {
    if (other.instanceId === movingItem.instanceId) return;

    const otherSize = getItemPixelSize(other);

    const otherLeft = other.x;
    const otherRight = other.x + otherSize.width;
    const otherTop = other.y;
    const otherBottom = other.y + otherSize.height;
    const otherCenterX = other.x + otherSize.width / 2;
    const otherCenterY = other.y + otherSize.height / 2;

    // LEFT ALIGN
    if (Math.abs(movingLeft - otherLeft) < SNAP_THRESHOLD) {
      snappedX = otherLeft;

      guides.push({
        type: "vertical",
        x: otherLeft,
      });
    }

    // RIGHT ALIGN
    if (Math.abs(movingRight - otherRight) < SNAP_THRESHOLD) {
      snappedX = otherRight - movingSize.width;

      guides.push({
        type: "vertical",
        x: otherRight,
      });
    }

    // CENTER X
    if (Math.abs(movingCenterX - otherCenterX) < SNAP_THRESHOLD) {
      snappedX = otherCenterX - movingSize.width / 2;

      guides.push({
        type: "vertical",
        x: otherCenterX,
      });
    }

    // TOP ALIGN
    if (Math.abs(movingTop - otherTop) < SNAP_THRESHOLD) {
      snappedY = otherTop;

      guides.push({
        type: "horizontal",
        y: otherTop,
      });
    }

    // BOTTOM ALIGN
    if (Math.abs(movingBottom - otherBottom) < SNAP_THRESHOLD) {
      snappedY = otherBottom - movingSize.height;

      guides.push({
        type: "horizontal",
        y: otherBottom,
      });
    }

    // CENTER Y
    if (Math.abs(movingCenterY - otherCenterY) < SNAP_THRESHOLD) {
      snappedY = otherCenterY - movingSize.height / 2;

      guides.push({
        type: "horizontal",
        y: otherCenterY,
      });
    }
  });

  const snapToBoothEdges = isPartiallyInsideBooth(movingItem) || isInsideBooth(movingItem);

  if (snapToBoothEdges) {
    const boothLeft = boothX;
    const boothRight = boothX + boothPixelWidth;
    const boothTop = boothY;
    const boothBottom = boothY + boothPixelHeight;

    if (Math.abs(movingLeft - boothLeft) < SNAP_THRESHOLD) {
      snappedX = boothLeft;
      guides.push({
        type: "vertical",
        x: boothLeft,
      });
    }

    if (Math.abs(movingRight - boothRight) < SNAP_THRESHOLD) {
      snappedX = boothRight - movingSize.width;
      guides.push({
        type: "vertical",
        x: boothRight,
      });
    }

    if (Math.abs(movingTop - boothTop) < SNAP_THRESHOLD) {
      snappedY = boothTop;
      guides.push({
        type: "horizontal",
        y: boothTop,
      });
    }

    if (Math.abs(movingBottom - boothBottom) < SNAP_THRESHOLD) {
      snappedY = boothBottom - movingSize.height;
      guides.push({
        type: "horizontal",
        y: boothBottom,
      });
    }
  }

  return {
    x: snappedX,
    y: snappedY,
    guides,
  };
};

const getSpacingGuides = (movingItem, itemList = items) => {
  const guides = [];
  const movingSize = getItemPixelSize(movingItem);

  const movingLeft = movingItem.x;
  const movingRight = movingItem.x + movingSize.width;
  const movingTop = movingItem.y;
  const movingBottom = movingItem.y + movingSize.height;

  itemList.forEach((other) => {
    if (other.instanceId === movingItem.instanceId) return;

    const otherSize = getItemPixelSize(other);

    const otherLeft = other.x;
    const otherRight = other.x + otherSize.width;
    const otherTop = other.y;
    const otherBottom = other.y + otherSize.height;

    const verticalOverlap =
      movingBottom > otherTop && movingTop < otherBottom;

    const horizontalOverlap =
      movingRight > otherLeft && movingLeft < otherRight;

    // Horizontal gap
    if (verticalOverlap) {
      let gap = null;
      let x1 = null;
      let x2 = null;
      let y = null;

      if (movingRight <= otherLeft) {
        gap = otherLeft - movingRight;
        x1 = movingRight;
        x2 = otherLeft;
        y = Math.max(movingTop, otherTop) + Math.abs(Math.min(movingBottom, otherBottom) - Math.max(movingTop, otherTop)) / 2;
      } else if (otherRight <= movingLeft) {
        gap = movingLeft - otherRight;
        x1 = otherRight;
        x2 = movingLeft;
        y = Math.max(movingTop, otherTop) + Math.abs(Math.min(movingBottom, otherBottom) - Math.max(movingTop, otherTop)) / 2;
      }

      if (gap !== null && gap <= FEET_TO_PIXEL * 5) {
        guides.push({
          type: "horizontal-gap",
          x1,
          x2,
          y,
          label: `${Math.round(gap / FEET_TO_PIXEL)} ft gap`,
        });
      }
    }

    // Vertical gap
    if (horizontalOverlap) {
      let gap = null;
      let y1 = null;
      let y2 = null;
      let x = null;

      if (movingBottom <= otherTop) {
        gap = otherTop - movingBottom;
        y1 = movingBottom;
        y2 = otherTop;
        x = Math.max(movingLeft, otherLeft) + Math.abs(Math.min(movingRight, otherRight) - Math.max(movingLeft, otherLeft)) / 2;
      } else if (otherBottom <= movingTop) {
        gap = movingTop - otherBottom;
        y1 = otherBottom;
        y2 = movingTop;
        x = Math.max(movingLeft, otherLeft) + Math.abs(Math.min(movingRight, otherRight) - Math.max(movingLeft, otherLeft)) / 2;
      }

      if (gap !== null && gap <= FEET_TO_PIXEL * 5) {
        guides.push({
          type: "vertical-gap",
          x,
          y1,
          y2,
          label: `${Math.round(gap / FEET_TO_PIXEL)} ft gap`,
        });
      }
    }
  });

  return guides.slice(0, 3);
};

const hasCollision = (itemToCheck, itemList = items) => {
  return itemList.some(
    (other) =>
      other.instanceId !== itemToCheck.instanceId &&
      isOverlapping(itemToCheck, other)
  );
};

const findNearestFreeSpace = (product, preferredX = null, preferredY = null) => {
  const productItem = {
    ...product,
    rotation: product.rotation || 0,
    x: boothX,
    y: boothY,
  };

  const size = getItemPixelSize(productItem);
  const positions = [];

  for (
    let y = boothY;
    y <= boothY + boothPixelHeight - size.height;
    y += FEET_TO_PIXEL
  ) {
    for (
      let x = boothX;
      x <= boothX + boothPixelWidth - size.width;
      x += FEET_TO_PIXEL
    ) {
      positions.push({ x, y });
    }
  }

  const targetX =
    preferredX !== null
      ? preferredX
      : boothX + boothPixelWidth / 2 - size.width / 2;

  const targetY =
    preferredY !== null
      ? preferredY
      : boothY + boothPixelHeight / 2 - size.height / 2;

  positions.sort((a, b) => {
    const distanceA = Math.hypot(a.x - targetX, a.y - targetY);
    const distanceB = Math.hypot(b.x - targetX, b.y - targetY);
    return distanceA - distanceB;
  });

  for (const position of positions) {
    const candidate = {
      ...productItem,
      x: position.x,
      y: position.y,
    };

    if (!hasCollision(candidate) && isInsideBooth(candidate)) {
      return position;
    }
  }

  return null;
};

const moveOverflowItemsToOuterCanvas = (nextBooth) => {
  const currentBoothX = boothX;
  const currentBoothY = boothY;

  const nextBoothPixelWidth = nextBooth.width * FEET_TO_PIXEL;
  const nextBoothPixelHeight = nextBooth.height * FEET_TO_PIXEL;

  const nextStageWidth = Math.max(canvasSize.width, nextBoothPixelWidth + 240);
  const nextStageHeight = Math.max(canvasSize.height, nextBoothPixelHeight + 220);

  const nextBoothX = Math.max(120, (nextStageWidth - nextBoothPixelWidth) / 2);
  const nextBoothY = Math.max(120, (nextStageHeight - nextBoothPixelHeight) / 2);

  let movedOutCount = 0;

  const moveToOuter = (item, index) => {
    const size = getItemPixelSize(item);

    return {
      ...item,
      placement: "outer",
      x: Math.min(
        nextBoothX + nextBoothPixelWidth + 60,
        nextStageWidth - size.width - 20
      ),
      y: Math.min(
        nextBoothY + index * 60,
        nextStageHeight - size.height - 20
      ),
    };
  };

  const updatedItems = items.map((item, index) => {
    const size = getItemPixelSize(item);

    const wasInsideCurrentBooth =
      item.placement === "booth" ||
      (!item.placement &&
        item.x >= currentBoothX &&
        item.y >= currentBoothY &&
        item.x + size.width <= currentBoothX + boothPixelWidth &&
        item.y + size.height <= currentBoothY + boothPixelHeight);

    // If item was already outer, keep it outer.
    // If larger booth now covers it, push it back outside.
    if (!wasInsideCurrentBooth) {
      const outerCandidate = { ...item, placement: "outer" };

      const overlapsNewBooth = !(
        outerCandidate.x + size.width <= nextBoothX ||
        outerCandidate.x >= nextBoothX + nextBoothPixelWidth ||
        outerCandidate.y + size.height <= nextBoothY ||
        outerCandidate.y >= nextBoothY + nextBoothPixelHeight
      );

      if (overlapsNewBooth) {
        return moveToOuter(outerCandidate, index);
      }

      return outerCandidate;
    }

    // If product itself cannot fit in the new booth, move outside.
    if (
      size.width > nextBoothPixelWidth ||
      size.height > nextBoothPixelHeight
    ) {
      movedOutCount += 1;
      return moveToOuter(item, index);
    }

    const relativeX = item.x - currentBoothX;
    const relativeY = item.y - currentBoothY;

    // Clamp booth items inside new booth instead of moving them out.
    return {
      ...item,
      placement: "booth",
      x: Math.min(
        Math.max(nextBoothX + relativeX, nextBoothX),
        nextBoothX + nextBoothPixelWidth - size.width
      ),
      y: Math.min(
        Math.max(nextBoothY + relativeY, nextBoothY),
        nextBoothY + nextBoothPixelHeight - size.height
      ),
    };
  });

  return {
    updatedItems,
    overflowCount: movedOutCount,
  };
};



const boothItems = useMemo(() => {
  return items.filter((item) => isInsideBooth(item));
}, [items, selectedBooth]);

const groupedBoothItems = useMemo(() => {
  const grouped = {};

  boothItems.forEach((item) => {
    const key = `${item.id}-${item.selectedAttributeLabel || "default"}`;

    if (!grouped[key]) {
      grouped[key] = {
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        color: item.color,
        productImage: item.productImage,
        image: item.image,
        attribute:
          item.selectedAttributeLabel ||
          `${getItemRealDimensions(item).widthFt}ft W x ${getItemRealDimensions(item).depthFt}ft D x ${getItemRealDimensions(item).heightFt}ft H`,
        quantity: 0,
      };
    }

    grouped[key].quantity += 1;
  });

  return Object.values(grouped);
}, [boothItems]);

const selectedAccessories = useMemo(() => {
  return ACCESSORIES
    .map((accessory) => ({
      ...accessory,
      quantity: accessoryQty[accessory.id] || 0,
    }))
    .filter((accessory) => accessory.quantity > 0);
}, [accessoryQty]);

const itemBucketCount =
  groupedBoothItems.reduce((sum, item) => sum + item.quantity, 0) +
  selectedAccessories.reduce((sum, item) => sum + item.quantity, 0);

const boothTotal = groupedBoothItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

const accessoriesTotal = selectedAccessories.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

const grandTotal = boothTotal + accessoriesTotal;

const boothAreaSqFt = selectedBooth.width * selectedBooth.height;

const usedAreaSqFt = boothItems.reduce((sum, item) => {
  const dimensions = getItemRealDimensions(item);
  return sum + dimensions.widthFt * dimensions.depthFt;
}, 0);

const utilizationPercent =
  boothAreaSqFt > 0 ? Math.round((usedAreaSqFt / boothAreaSqFt) * 100) : 0;

const utilizationStatus =
  utilizationPercent < 30
    ? "Comfortable"
    : utilizationPercent <=45
    ? "Moderate"
    : "Crowded";


  const MIN_CLEARANCE_FT = 2;

  const getClearanceWarnings = () => {
    const warnings = [];

    boothItems.forEach((itemA, indexA) => {
      const sizeA = getItemPixelSize(itemA);

      const leftA = itemA.x;
      const rightA = itemA.x + sizeA.width;
      const topA = itemA.y;
      const bottomA = itemA.y + sizeA.height;

      boothItems.forEach((itemB, indexB) => {
        if (indexB <= indexA) return;

        const sizeB = getItemPixelSize(itemB);

        const leftB = itemB.x;
        const rightB = itemB.x + sizeB.width;
        const topB = itemB.y;
        const bottomB = itemB.y + sizeB.height;

        const verticalOverlap = bottomA > topB && topA < bottomB;
        const horizontalOverlap = rightA > leftB && leftA < rightB;

        if (verticalOverlap) {
          const gapPx =
            rightA <= leftB ? leftB - rightA : leftA >= rightB ? leftA - rightB : null;

          if (
            gapPx !== null &&
            gapPx > 0 &&
            gapPx < MIN_CLEARANCE_FT * FEET_TO_PIXEL
          ) {
            warnings.push(
              `${itemA.name} and ${itemB.name} have less than ${MIN_CLEARANCE_FT} ft side clearance.`
            );
          }
        }

        if (horizontalOverlap) {
          const gapPx =
            bottomA <= topB ? topB - bottomA : topA >= bottomB ? topA - bottomB : null;

          if (
            gapPx !== null &&
            gapPx > 0 &&
            gapPx < MIN_CLEARANCE_FT * FEET_TO_PIXEL
          ) {
            warnings.push(
              `${itemA.name} and ${itemB.name} have less than ${MIN_CLEARANCE_FT} ft front/back clearance.`
            );
          }
        }
      });
    });

    return warnings;
  };

const clearanceWarnings = getClearanceWarnings();

const getClearanceProblemItemIds = () => {
  const problemIds = new Set();

  boothItems.forEach((itemA, indexA) => {
    const sizeA = getItemPixelSize(itemA);

    const leftA = itemA.x;
    const rightA = itemA.x + sizeA.width;
    const topA = itemA.y;
    const bottomA = itemA.y + sizeA.height;

    boothItems.forEach((itemB, indexB) => {
      if (indexB <= indexA) return;

      const sizeB = getItemPixelSize(itemB);

      const leftB = itemB.x;
      const rightB = itemB.x + sizeB.width;
      const topB = itemB.y;
      const bottomB = itemB.y + sizeB.height;

      const verticalOverlap = bottomA > topB && topA < bottomB;
      const horizontalOverlap = rightA > leftB && leftA < rightB;

      if (verticalOverlap) {
        const gapPx =
          rightA <= leftB ? leftB - rightA : leftA >= rightB ? leftA - rightB : null;

        if (
          gapPx !== null &&
          gapPx > 0 &&
          gapPx < MIN_CLEARANCE_FT * FEET_TO_PIXEL
        ) {
          problemIds.add(itemA.instanceId);
          problemIds.add(itemB.instanceId);
        }
      }

      if (horizontalOverlap) {
        const gapPx =
          bottomA <= topB ? topB - bottomA : topA >= bottomB ? topA - bottomB : null;

        if (
          gapPx !== null &&
          gapPx > 0 &&
          gapPx < MIN_CLEARANCE_FT * FEET_TO_PIXEL
        ) {
          problemIds.add(itemA.instanceId);
          problemIds.add(itemB.instanceId);
        }
      }
    });
  });

  return problemIds;
};

const clearanceProblemItemIds = getClearanceProblemItemIds();

const getPlacementSuggestions = () => {
  const suggestions = [];

  boothItems.forEach((item) => {
    const size = getItemPixelSize(item);

    const itemLeft = item.x;
    const itemRight = item.x + size.width;
    const itemTop = item.y;
    const itemBottom = item.y + size.height;

    const nearLeftWall = Math.abs(itemLeft - boothX) <= FEET_TO_PIXEL;
    const nearRightWall =
      Math.abs(itemRight - (boothX + boothPixelWidth)) <= FEET_TO_PIXEL;
    const nearTopWall = Math.abs(itemTop - boothY) <= FEET_TO_PIXEL;
    const nearBottomWall =
      Math.abs(itemBottom - (boothY + boothPixelHeight)) <= FEET_TO_PIXEL;

    const isHorizontal = size.width >= size.height;

    const nearAnyWall = isHorizontal
      ? nearTopWall || nearBottomWall
      : nearLeftWall || nearRightWall;

    if (item.placementRole === "wall_display" && !nearAnyWall) {
      suggestions.push(
        `${item.name} usually works best along a booth wall or edge.`
      );
    }

    if (item.placementRole === "visitor_facing") {
      const nearAisle =
        (nearTopWall && adjacentAreas.top === "Aisle") ||
        (nearRightWall && adjacentAreas.right === "Aisle") ||
        (nearBottomWall && adjacentAreas.bottom === "Aisle") ||
        (nearLeftWall && adjacentAreas.left === "Aisle");

      if (!nearAisle) {
        suggestions.push(
          `${item.name} may work better near an aisle-facing side for visitor interaction.`
        );
      }
    }
  });

  return suggestions;
};

const placementSuggestions = getPlacementSuggestions();

const getFlowHeatmapZones = () => {
  const zones = [];

  const cellSize = FEET_TO_PIXEL * 2;

  for (let y = boothY; y < boothY + boothPixelHeight; y += cellSize) {
    for (let x = boothX; x < boothX + boothPixelWidth; x += cellSize) {
      const cell = {
        x,
        y,
        width: Math.min(cellSize, boothX + boothPixelWidth - x),
        height: Math.min(cellSize, boothY + boothPixelHeight - y),
      };

      const overlappingItems = boothItems.filter((item) => {
        const size = getItemPixelSize(item);

        return !(
          item.x + size.width <= cell.x ||
          item.x >= cell.x + cell.width ||
          item.y + size.height <= cell.y ||
          item.y >= cell.y + cell.height
        );
      });

      if (overlappingItems.length === 0) continue;

      const intensity =
        overlappingItems.length >= 2 ? "high" : "medium";

      zones.push({
        ...cell,
        intensity,
      });
    }
  }

  return zones;
};

const flowHeatmapZones = getFlowHeatmapZones();
const getBoothQualityScore = () => {
  let score = 100;
  const feedback = [];

  if (items.length === 0) {
    return {
      score: 0,
      status: "No layout yet",
      feedback: ["Add booth products to generate a booth score."],
    };
  }

  if (utilizationStatus === "Crowded") {
    score -= 20;
    feedback.push("Booth may feel crowded because floor usage is above 45%.");
  } else if (utilizationStatus === "Moderate") {
    score -= 8;
    feedback.push("Booth usage is moderate. Keep enough open space for visitors.");
  } else {
    feedback.push("Good open floor space for visitor movement.");
  }

  if (clearanceWarnings.length > 0) {
    score -= Math.min(25, clearanceWarnings.length * 10);
    feedback.push("Some products have less than 2 ft clearance.");
  } else {
    feedback.push("Good spacing between booth items.");
  }

  if (placementSuggestions.length > 0) {
    score -= Math.min(15, placementSuggestions.length * 6);
    feedback.push("Some products may work better in a different position.");
  } else {
    feedback.push("Product placement looks appropriate.");
  }

  const highCongestionZones = flowHeatmapZones.filter(
    (zone) => zone.intensity === "high"
  );

  if (highCongestionZones.length > 0) {
    score -= Math.min(15, highCongestionZones.length * 5);
    feedback.push("Some areas may reduce visitor flow or demo space.");
  } else {
    feedback.push("No major congestion zones detected.");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const status =
    score >= 85
      ? "Excellent"
      : score >= 70
      ? "Good"
      : score >= 50
      ? "Needs Improvement"
      : "Poor";

  return {
    score,
    status,
    feedback,
  };
};

const boothQuality = getBoothQualityScore();

const groupedByCategory = useMemo(() => {
  const grouped = {};

  groupedBoothItems.forEach((item) => {
    const category = item.category || "Other";

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(item);
  });

  if (selectedAccessories.length > 0) {
    grouped["Accessories"] = selectedAccessories.map((item) => ({
      ...item,
      attribute: "Accessory",
    }));
  }

  return grouped;
}, [groupedBoothItems, selectedAccessories]);

const gridLines = useMemo(() => {
  const lines = [];

  for (let i = 0; i <= selectedBooth.width; i++) {
    const x = boothX + i * FEET_TO_PIXEL;
    lines.push(
      <Line
        key={`v-${i}`}
        points={[x, boothY, x, boothY + boothPixelHeight]}
        stroke={i === 0 || i === selectedBooth.width ? "#1f2937" : "#e5e7eb"}
        strokeWidth={i === 0 || i === selectedBooth.width ? 2 : 1}
      />
    );
  }

  for (let i = 0; i <= selectedBooth.height; i++) {
    const y = boothY + i * FEET_TO_PIXEL;
    lines.push(
      <Line
        key={`h-${i}`}
        points={[boothX, y, boothX + boothPixelWidth, y]}
        stroke={i === 0 || i === selectedBooth.height ? "#111827" : "#d1d5db"}
        strokeWidth={i === 0 || i === selectedBooth.height ? 2 : 1}
      />
    );
  }

  return lines;
}, [selectedBooth, boothX, boothY, boothPixelWidth, boothPixelHeight]);

const measurementLabels = useMemo(() => {
  const labels = [];

  for (let i = 0; i <= selectedBooth.width; i++) {
    labels.push(
      <Text
        key={`top-label-${i}`}
        text={`${i}'`}
        x={boothX + i * FEET_TO_PIXEL - 8}
        y={boothY - 51}
        fontSize={12}
        fill="#374151"
      />
    );
  }

  for (let i = 0; i <= selectedBooth.height; i++) {
    labels.push(
      <Text
        key={`left-label-${i}`}
        text={`${i}'`}
        x={boothX - 60}
        y={boothY + i * FEET_TO_PIXEL - 7}
        fontSize={12}
        fill="#374151"
      />
    );
  }

  return labels;
}, [selectedBooth, boothX, boothY]);

const updateItemsWithHistory = (nextItems) => {
  setHistory((prev) => [...prev, items]);
  setFuture([]);
  setItems(nextItems);
};

const getProductById = (productId) => {
  return SAMPLE_PRODUCTS.find((product) => product.id === productId);
};

const hasRequiredProductInBooth = (requiredProductId) => {
  return items.some(
    (item) =>
      item.id === requiredProductId &&
      (item.placement === "booth" || isInsideBooth(item))
  );
};

const getDependentItems = (baseProductId) => {
  return items.filter((item) => item.requiresProductId === baseProductId);
};

const handleAddItem = (product) => {
  if (product.requiresProductId) {
  const requiredProduct = getProductById(product.requiresProductId);

  if (!hasRequiredProductInBooth(product.requiresProductId)) {
    showMessage(
      `${product.name} requires ${requiredProduct?.name || "another product"} to be added first.`
    );
    return;
  }
}

const selectedAttributeLabel =
  selectedProductAttributes[product.id] ||
  product.attributes?.[0]?.label;

const selectedAttribute =
  product.attributes?.find((attr) => attr.label === selectedAttributeLabel) ||
  product.attributes?.[0];

const productWithAttribute = selectedAttribute
  ? {
      ...product,
      selectedAttributeLabel: selectedAttribute.label,
      price: selectedAttribute.price ?? product.price,
      dimensions: {
          widthFt: selectedAttribute.widthFt,
          depthFt: selectedAttribute.depthFt,
          heightFt: selectedAttribute.heightFt,
        },
        canvasImage: selectedAttribute.canvasImage || product.canvasImage,
        productImage: selectedAttribute.productImage || product.productImage,
    }
  : product;

  const productItem = {
  ...productWithAttribute,
    rotation: 0,
    x: boothX,
    y: boothY,
  };

  const size = getItemPixelSize(productItem);

  const preferredX = snapToGrid(
    boothX + boothPixelWidth / 2 - size.width / 2
  );

  const preferredY = snapToGrid(
    boothY + boothPixelHeight / 2 - size.height / 2
  );

  const position = findNearestFreeSpace(productWithAttribute, preferredX, preferredY);

  if (!position) {
    showMessage("No more space in the Booth Left to place the Item");
    return;
  }

  const newItem = {
    ...productWithAttribute,
    instanceId: Date.now(),
    x: position.x,
    y: position.y,
    rotation: 0,
    locked: false,
    placement: "booth",
  };

  trackEvent("product_added", {
    product_name: product.name,
    product_category: product.category,
    booth_size: selectedBooth.label,
  });

  updateItemsWithHistory([...items, newItem]);
  setSelectedItemId(newItem.instanceId);
  setSelectedItemIds([newItem.instanceId]);
};

const handleGroupDragStart = (item) => {
  if (!selectedItemIds.includes(item.instanceId) || selectedItemIds.length <= 1) {
    groupDragStartRef.current = null;
    return;
  }

  groupDragStartRef.current = {
    draggedItemId: item.instanceId,
    startX: item.x,
    startY: item.y,
    items: items
      .filter((it) => selectedItemIds.includes(it.instanceId))
      .map((it) => ({
        instanceId: it.instanceId,
        x: it.x,
        y: it.y,
      })),
  };
};

const handleGroupDragMove = (e, item) => {
  if (!groupDragStartRef.current) return;

  const dragState = groupDragStartRef.current;

  if (dragState.draggedItemId !== item.instanceId) return;

  const dx = e.target.x() - dragState.startX;
  const dy = e.target.y() - dragState.startY;

  setItems((prevItems) =>
    prevItems.map((it) => {
      const startItem = dragState.items.find(
        (saved) => saved.instanceId === it.instanceId
      );

      if (!startItem) return it;

      return {
        ...it,
        x: startItem.x + dx,
        y: startItem.y + dy,
      };
    })
  );
};

const handleGroupDragEnd = (e, item) => {
  if (!groupDragStartRef.current) {
    handleDragEnd(e, item);
    return;
  }

  groupDragStartRef.current = null;

  setAlignmentGuides([]);
  setSpacingGuides([]);

  setItems((prevItems) =>
    prevItems.map((it) => ({
      ...it,
      placement: isInsideBooth(it) ? "booth" : "outer",
    }))
  );
};

const handleDragEnd = (e, item) => {
  if (item.locked) {
    e.target.position({ x: item.x, y: item.y });
    return;
  }

  let newX = snapToGrid(e.target.x());
  let newY = snapToGrid(e.target.y());

  let movedItem = {
    ...item,
    x: newX,
    y: newY,
  };

  // Keep item inside total stage/canvas area
  if (!isInsideStage(movedItem)) {
    e.target.position({ x: item.x, y: item.y });
    showMessage("Item must stay inside the canvas area");
    return;
  }

// If item is partially inside booth, decide based on item center point
if (isPartiallyInsideBooth(movedItem) && !isInsideBooth(movedItem)) {
  const size = getItemPixelSize(movedItem);

  const itemCenterX = movedItem.x + size.width / 2;
  const itemCenterY = movedItem.y + size.height / 2;

  const centerInsideBooth =
    itemCenterX >= boothX &&
    itemCenterX <= boothX + boothPixelWidth &&
    itemCenterY >= boothY &&
    itemCenterY <= boothY + boothPixelHeight;

  if (centerInsideBooth) {
    movedItem = snapItemFullyInsideBooth(movedItem);
  }
}

  // Prevent overlap with any other item
  if (hasCollision(movedItem)) {
    setInvalidItemId(item.instanceId);
    e.target.position({ x: item.x, y: item.y });
    showMessage("Item cannot overlap another item");

    setTimeout(() => {
      setInvalidItemId(null);
    }, 900);

    return;
  }

  const finalItem = {
    ...movedItem,
    placement: isInsideBooth(movedItem) ? "booth" : "outer",
    };

    updateItemsWithHistory(
    items.map((it) => (it.instanceId === item.instanceId ? finalItem : it))
  );
};

const handleDelete = () => {
  if (selectedItemIds.length === 0) return;

  const selectedSet = new Set(selectedItemIds);

  const lockedSelectedItems = items.filter(
    (item) => selectedSet.has(item.instanceId) && item.locked
  );

  if (lockedSelectedItems.length > 0) {
    showMessage("Unlock selected items before deleting");
    return;
  }

  const selectedProductIds = items
    .filter((item) => selectedSet.has(item.instanceId))
    .map((item) => item.id);

  const dependentItems = items.filter(
    (item) =>
      item.requiresProductId &&
      selectedProductIds.includes(item.requiresProductId) &&
      !selectedSet.has(item.instanceId)
  );

  let idsToDelete = [...selectedItemIds];

  if (dependentItems.length > 0) {
    const confirmed = window.confirm(
      `Some selected items are required by ${dependentItems.length} dependent item${
        dependentItems.length > 1 ? "s" : ""
      }. Deleting them will also remove the dependent item${
        dependentItems.length > 1 ? "s" : ""
      }. Continue?`
    );

    if (!confirmed) return;

    idsToDelete = [
      ...idsToDelete,
      ...dependentItems.map((item) => item.instanceId),
    ];
  }

  updateItemsWithHistory(
    items.filter((item) => !idsToDelete.includes(item.instanceId))
  );

  clearSelection();
};

const handleRotate = () => {
  if (!selectedItem) return;

  if (selectedItem.locked) {
    showMessage("Unlock this item before rotating it");
    return;
  }

let rotatedItem = {
  ...selectedItem,
  rotation: (selectedItem.rotation + 90) % 360,
};

if (selectedItem.placement === "booth" || isInsideBooth(selectedItem)) {
  rotatedItem = snapItemFullyInsideBooth(rotatedItem);
}

if (!isInsideBooth(rotatedItem) || hasCollision(rotatedItem)) {
  showMessage("Not Enough Space in Booth");
  return;
}

  updateItemsWithHistory(
    items.map((item) =>
      item.instanceId === selectedItem.instanceId ? rotatedItem : item
    )
  );
};

const handleDuplicate = () => {
  if (selectedItemIds.length === 0) return;

  const selectedSet = new Set(selectedItemIds);
  const itemsToDuplicate = items.filter((item) =>
    selectedSet.has(item.instanceId)
  );

  const duplicatedItems = [];

  for (const item of itemsToDuplicate) {
    const candidate = {
      ...item,
      instanceId: Date.now() + Math.random(),
      x: item.x + FEET_TO_PIXEL,
      y: item.y + FEET_TO_PIXEL,
      locked: false,
      placement: item.placement || "booth",
    };

    if (!isInsideStage(candidate) || hasCollision(candidate, [...items, ...duplicatedItems])) {
      showMessage("Not Enough Space to Duplicate Selected Items");
      return;
    }

    duplicatedItems.push(candidate);
  }

  updateItemsWithHistory([...items, ...duplicatedItems]);

  const newIds = duplicatedItems.map((item) => item.instanceId);

  setSelectedItemId(newIds[newIds.length - 1]);
  setSelectedItemIds(newIds);
};

const getSelectedLayoutItems = () => {
  const selectedSet = new Set(selectedItemIds);

  return items.filter((item) => selectedSet.has(item.instanceId));
};

const handleAlignSelected = (type) => {
  const selectedLayoutItems = getSelectedLayoutItems();

  if (selectedLayoutItems.length < 2) {
    showMessage("Select at least two items to align");
    return;
  }

  const itemBounds = selectedLayoutItems.map((item) => {
    const size = getItemPixelSize(item);

    return {
      ...item,
      widthPx: size.width,
      heightPx: size.height,
      left: item.x,
      right: item.x + size.width,
      top: item.y,
      bottom: item.y + size.height,
      centerX: item.x + size.width / 2,
      centerY: item.y + size.height / 2,
    };
  });

  const minLeft = Math.min(...itemBounds.map((item) => item.left));
  const maxRight = Math.max(...itemBounds.map((item) => item.right));
  const minTop = Math.min(...itemBounds.map((item) => item.top));
  const maxBottom = Math.max(...itemBounds.map((item) => item.bottom));

  const centerX = (minLeft + maxRight) / 2;
  const centerY = (minTop + maxBottom) / 2;

  const updatedItems = items.map((item) => {
    const bound = itemBounds.find((entry) => entry.instanceId === item.instanceId);

    if (!bound) return item;

    if (item.locked) return item;

    if (type === "left") {
      return { ...item, x: minLeft };
    }

    if (type === "center") {
      return { ...item, x: centerX - bound.widthPx / 2 };
    }

    if (type === "right") {
      return { ...item, x: maxRight - bound.widthPx };
    }

    if (type === "top") {
      return { ...item, y: minTop };
    }

    if (type === "middle") {
      return { ...item, y: centerY - bound.heightPx / 2 };
    }

    if (type === "bottom") {
      return { ...item, y: maxBottom - bound.heightPx };
    }

    return item;
  });

  updateItemsWithHistory(updatedItems);
};

const handleDistributeSelected = (direction) => {
  const selectedLayoutItems = getSelectedLayoutItems().filter((item) => !item.locked);

  if (selectedLayoutItems.length < 3) {
    showMessage("Select at least three unlocked items to distribute");
    return;
  }

  const itemBounds = selectedLayoutItems.map((item) => {
    const size = getItemPixelSize(item);

    return {
      ...item,
      widthPx: size.width,
      heightPx: size.height,
      left: item.x,
      right: item.x + size.width,
      top: item.y,
      bottom: item.y + size.height,
    };
  });

  if (direction === "horizontal") {
    const sorted = [...itemBounds].sort((a, b) => a.left - b.left);

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const availableSpace =
      last.left - first.left;

    const step = availableSpace / (sorted.length - 1);

    const updatedItems = items.map((item) => {
      const index = sorted.findIndex((entry) => entry.instanceId === item.instanceId);

      if (index === -1) return item;

      return {
        ...item,
        x: first.left + step * index,
      };
    });

    updateItemsWithHistory(updatedItems);
    return;
  }

  if (direction === "vertical") {
    const sorted = [...itemBounds].sort((a, b) => a.top - b.top);

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const availableSpace =
      last.top - first.top;

    const step = availableSpace / (sorted.length - 1);

    const updatedItems = items.map((item) => {
      const index = sorted.findIndex((entry) => entry.instanceId === item.instanceId);

      if (index === -1) return item;

      return {
        ...item,
        y: first.top + step * index,
      };
    });

    updateItemsWithHistory(updatedItems);
  }
};


const handleToggleLock = () => {
  if (selectedItemIds.length === 0) return;

  const selectedSet = new Set(selectedItemIds);

  const selectedItemsForLock = items.filter((item) =>
    selectedSet.has(item.instanceId)
  );

  const shouldLock = selectedItemsForLock.some((item) => !item.locked);

  updateItemsWithHistory(
    items.map((item) =>
      selectedSet.has(item.instanceId)
        ? { ...item, locked: shouldLock }
        : item
    )
  );
};

const updateAccessoryQty = (accessoryId, change) => {
  setAccessoryQty((prev) => {
    const nextQty = Math.max(0, (prev[accessoryId] || 0) + change);
    return { ...prev, [accessoryId]: nextQty };
  });
};

const handleOpenFinalWindow = () => {
  if (stageRef.current) {
    const dataUrl = stageRef.current.toDataURL({
      pixelRatio: 2,
      mimeType: "image/png",
    });

    setLayoutSnapshot(dataUrl);
  }

  trackEvent("final_summary_opened", {
    booth_size: selectedBooth.label,
    booth_score: boothQuality.score,
    total_items: groupedBoothItems.length,
  });
  setFinalWindowOpen(true);
};

const handleLeadInputChange = (e) => {
  const { name, value } = e.target;

  setLeadForm((prev) => ({
    ...prev,
    [name]: value,
  }));

  setLeadError("");
};

const handleDownloadButtonClick = () => {
  if (!leadCaptured) {
    setShowLeadCapture(true);
    return;
  }

  handleDownloadPDF();
};

const handleLeadSubmit = async (e) => {
  e.preventDefault();

  if (!leadForm.name.trim()) {
    setLeadError("Please enter your name.");
    return;
  }

  if (!leadForm.email.trim()) {
    setLeadError("Please enter your email.");
    return;
  }

  setLeadSaving(true);
  setLeadError("");

  let designLinkForLead = onlineSaveUrl || "";

  try {
    if (!designLinkForLead) {
    const createdLink = await createOnlineDesignLink(
      leadForm.company || leadForm.name || "Booth Design"
    );

    if (createdLink) {
      designLinkForLead = createdLink;
      setOnlineSaveUrl(createdLink);
      console.log("Auto-created design link:", createdLink);
    } else {
      designLinkForLead = window.location.href;
      console.warn("Design link was not created. Using current page URL.");
    }
  }

    const payload = {
      name: leadForm.name,
      email: leadForm.email,
      phone: leadForm.phone,
      company: leadForm.company,
      booth_size: selectedBooth.label,
      booth_type: boothType,
      booth_score: boothQuality.score,
      utilization_percent: utilizationPercent,
      total_estimate: grandTotal,
      total_items: groupedBoothItems.length,
      design_link: designLinkForLead,
      created_at: new Date().toISOString(),
    };

    console.log("Saving lead payload:", payload);

    const { error } = await supabase
      .from("booth_leads")
      .insert([payload]);

    if (error) {
      console.error("Lead save failed:", error);
      setLeadError("Lead save failed. Please check Supabase.");
      return;
    }

    trackEvent("lead_submitted", {
      booth_size: selectedBooth.label,
      booth_score: boothQuality.score,
      total_estimate: grandTotal,
    });
    setLeadCaptured(true);
    setShowLeadCapture(false);

    setTimeout(() => {
      handleDownloadPDF();
    }, 120);
  } catch (error) {
    console.error("Lead submit failed:", error);
    setLeadError("Something failed while saving. Please check console.");
  } finally {
    setLeadSaving(false);
  }
};

const handleDownloadPDF = async () => {
  try {
    trackEvent("pdf_download_started", {
      booth_size: selectedBooth.label,
      booth_score: boothQuality.score,
      total_estimate: grandTotal,
    });
    if (!stageRef.current) {
      alert("PDF could not be generated because the canvas is not ready.");
      return;
    }

    const boothImage = stageRef.current.toDataURL({
      pixelRatio: 2,
      mimeType: "image/png",
    });

    const quoteItems = groupedBoothItems;
    const quoteTotal = boothTotal;
    const designLinkForPdf = onlineSaveUrl || "Design link will be available after online save.";
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const categorySections = Object.entries(groupedByCategory)
      .map(([category, categoryItems]) => {
        const rows = categoryItems
          .map(
            (item) => `
              <tr>
                <td>
                  <strong>${item.name}</strong>
                </td>
                <td>${item.attribute || "Default"}</td>
                <td>${item.quantity}</td>
                <td>$${item.price * item.quantity}</td>
                <td></td>
                <td></td>
              </tr>
            `
          )
          .join("");

        return `
          <div class="pd-pdf-category">
            <h3>${category}</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Attribute</th>
                  <th>Qty</th>
                  <th>Estimate Price</th>
                  <th>Quote Price</th>
                  <th>% Discount</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        `;
      })
      .join("");

    const pdfContainer = document.createElement("div");

    pdfContainer.style.position = "absolute";
    pdfContainer.style.left = "0";
    pdfContainer.style.top = "0";
    pdfContainer.style.width = "8.5in";
    pdfContainer.style.background = "#ffffff";
    pdfContainer.style.zIndex = "-1";
    pdfContainer.style.pointerEvents = "none";

    pdfContainer.innerHTML = `
      <div class="pd-pdf-page">
        <div class="pd-pdf-header">
          <div>
            <h1>Trade Show Booth Quote Summary</h1>
            <p>Generated by PrintDrill Booth Designer</p>
          </div>

          <div class="pd-pdf-brand-box">
            <strong>PrintDrill</strong>
            <span>Custom Trade Show Displays</span>
          </div>
        </div>

        <div class="pd-pdf-meta-grid">
          <div>
            <span>Booth Size</span>
            <strong>${selectedBooth.label} ft</strong>
          </div>

          <div>
            <span>Booth Type</span>
            <strong>${boothType || "Not Specified"}</strong>
          </div>

          <div>
            <span>Quote Items</span>
            <strong>${quoteItems.length}</strong>
          </div>

          <div>
            <span>Date</span>
            <strong>${today}</strong>
          </div>
        </div>

        <div class="pd-pdf-section">
          <div class="pd-pdf-section-title">
            <h2>Booth Layout</h2>
            <span>Top-view planning snapshot</span>
          </div>

          <div class="pd-pdf-layout-box">
            <img src="${boothImage}" />
          </div>
        </div>

        <div class="pd-pdf-section">
          <div class="pd-pdf-section-title">
            <h2>Booth Components</h2>
            <span>Only items placed inside the booth are included below</span>
          </div>

          ${
            categorySections ||
            `<p class="pd-pdf-muted">No booth components added yet.</p>`
          }
        </div>

        <div class="pd-pdf-score-section">
            <div>
              <span>Booth Quality Score</span>
              <strong>${boothQuality.score}/100</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>${boothQuality.status}</strong>
            </div>
          </div>

          <div class="pd-pdf-score-notes">
            ${boothQuality.feedback
              .slice(0, 4)
              .map((note) => `<p>${note}</p>`)
              .join("")}
        </div>

        <div class="pd-pdf-utilization">
          <div>
            <span>Booth Space Used</span>
            <strong>${utilizationPercent}%</strong>
          </div>

          ${
            utilizationStatus === "Crowded"
               ? `
                 <div class="pd-pdf-warning-box">
                   <strong>Layout Warning</strong>
                   <p>
                     This booth uses more than 45% of available floor space. It may limit visitor
                     movement, product demos, or lead capture space.
                   </p>
                 </div>
               `
              : ""
          }

          ${
            clearanceWarnings.length > 0
              ? `
                <div class="pd-pdf-warning-box">
                  <strong>Clearance Warning</strong>
                  <p>${clearanceWarnings[0]}</p>
                </div>
              `
              : ""
          }

          ${
            placementSuggestions.length > 0
              ? `
                <div class="pd-pdf-suggestion-box">
                  <strong>Placement Suggestion</strong>
                  <p>${placementSuggestions[0]}</p>
                </div>
              `
              : ""
          }

          <div>
            <span>Used Area</span>
            <strong>${usedAreaSqFt} sq ft</strong>
          </div>

          <div>
            <span>Total Booth Area</span>
            <strong>${boothAreaSqFt} sq ft</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>${utilizationStatus}</strong>
          </div>
        </div>

        <div class="pd-pdf-total-section">
          <div>
            <span>Total Estimate</span>
            <strong>$${quoteTotal}</strong>
          </div>

          <div>
            <span>Quote Price</span>
            <strong class="pd-pdf-blank"></strong>
          </div>

          <div>
            <span>Discount %</span>
            <strong class="pd-pdf-blank"></strong>
          </div>
        </div>

        <div class="pd-pdf-note-box">
          <strong>Next Step</strong>
          <p>
            Send this booth layout PDF to hello@printdrill.com for a personalized quote,
            design review, and product recommendation.
          </p>

          <div class="pd-pdf-design-link">
            <strong>Online Design Link</strong>
            <span>${designLinkForPdf}</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(pdfContainer);

    await html2pdf()
      .set({
        margin: 0,
        filename: `printdrill-booth-quote-${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "portrait",
        },
      })
      .from(pdfContainer.firstElementChild)
      .save();

    document.body.removeChild(pdfContainer);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("PDF generation failed. Please check the browser console.");
  }
};

const handleUndo = () => {
  if (history.length === 0) return;

  const previousItems = history[history.length - 1];

  setFuture((prev) => [items, ...prev]);
  setItems(previousItems);
  setHistory((prev) => prev.slice(0, -1));
  clearSelection();
};

const handleRedo = () => {
  if (future.length === 0) return;

  const nextItems = future[0];

  setHistory((prev) => [...prev, items]);
  setItems(nextItems);
  setFuture((prev) => prev.slice(1));
  clearSelection();
};

const handleClearAll = () => {
  if (items.length === 0) return;

  updateItemsWithHistory([]);
  clearSelection();
};

const handleRotateBoothOrientation = () => {
  const oldBooth = selectedBooth;

  const newBooth = {
    label: `${oldBooth.height} x ${oldBooth.width}`,
    width: oldBooth.height,
    height: oldBooth.width,
  };

  const oldBoothPixelWidth = oldBooth.width * FEET_TO_PIXEL;
  const oldBoothPixelHeight = oldBooth.height * FEET_TO_PIXEL;

  const newBoothPixelWidth = newBooth.width * FEET_TO_PIXEL;
  const newBoothPixelHeight = newBooth.height * FEET_TO_PIXEL;

  const updatedItems = items.map((item) => {
    const itemSize = getItemPixelSize(item);

    const itemCenterX = item.x + itemSize.width / 2;
    const itemCenterY = item.y + itemSize.height / 2;

    const isBoothItem =
      item.placement === "booth" || isInsideBooth(item);

    if (!isBoothItem) {
      return item;
    }

    const relativeCenterX = itemCenterX - boothX;
    const relativeCenterY = itemCenterY - boothY;

    const rotatedRelativeCenterX =
      relativeCenterY;

    const rotatedRelativeCenterY =
      oldBoothPixelWidth - relativeCenterX;

    const rotatedItem = {
      ...item,
      rotation: ((item.rotation || 0) + 90) % 360,
    };

    const rotatedSize = getItemPixelSize(rotatedItem);

    return {
      ...rotatedItem,
      x: boothX + rotatedRelativeCenterX - rotatedSize.width / 2,
      y: boothY + rotatedRelativeCenterY - rotatedSize.height / 2,
      placement: "booth",
    };
  });

  setSelectedBooth(newBooth);
  updateItemsWithHistory(updatedItems);
  clearSelection();

  setTimeout(() => {
    fitBoothToView();
  }, 80);

  showMessage("Booth orientation rotated");
};

const handleBoothTypeChange = (type) => {
  setBoothType(type);
  setAdjacentAreas(BOOTH_TYPE_PRESETS[type]);
};

const getNextAdjacentType = (currentType) => {
  const currentIndex = ADJACENT_TYPES.indexOf(currentType);
  return ADJACENT_TYPES[(currentIndex + 1) % ADJACENT_TYPES.length];
};

const handleAdjacentClick = (side) => {
  const currentType = adjacentAreas[side];
  const nextType = getNextAdjacentType(currentType);

  const updatedAreas = {
    ...adjacentAreas,
    [side]: nextType,
  };

  const hasAisle = Object.values(updatedAreas).some(
    (value) => value === "Aisle"
  );

  if (!hasAisle) {
    updatedAreas[side] = "Aisle";
    showMessage("At least one side must remain Aisle");
  }

  setAdjacentAreas(updatedAreas);
  setBoothType("Not Specified");
};

const handleStartNewDesign = () => {
  const confirmed = window.confirm(
    "Start a new booth design? This will clear the current canvas."
  );

  if (!confirmed) return;

  setItems([]);
  setAccessoryQty({});
  setSelectedItemId(null);
  setSelectedItemIds([]);
  setOnlineSaveUrl("");
  setLoadedFromSupabase(false);
  setHistory([]);
  setFuture([]);

  window.history.replaceState({}, "", window.location.pathname);

  showMessage("Started a new booth design");
};

const handleEmailOnlineSaveUrl = () => {
  if (!onlineSaveUrl) return;

  const subject = encodeURIComponent("PrintDrill Booth Design Link");

  const body = encodeURIComponent(
    `Hi,\n\nHere is the booth design link:\n\n${onlineSaveUrl}\n\nThanks.`
  );

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

const handleCopyOnlineSaveUrl = async () => {
  if (!onlineSaveUrl) return;

  try {
    await navigator.clipboard.writeText(onlineSaveUrl);
    showMessage("Share link copied");
  } catch (error) {
    console.error("Copy failed:", error);
    showMessage("Could not copy link");
  }
};

const createOnlineDesignLink = async (
  designName = "Booth Design"
) => {

  const payload = {
    design_name: designName,
    booth_size: selectedBooth,
    booth_type: boothType,
    adjacent_areas: adjacentAreas,
    items,
    accessory_qty: accessoryQty,
    booth_score: boothQuality.score,
    utilization_percent: utilizationPercent,
    total_estimate: grandTotal,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("booth_designs")
    .insert([payload])
    .select("id")
    .single();

  if (error) {
    console.error("createOnlineDesignLink error:", error);
    throw error;
  }

  console.log("createOnlineDesignLink success:", data);

  return `${window.location.origin}${window.location.pathname}?design=${data.id}`;
};

const handleSaveDesignOnline = async () => {

  if (items.length === 0 && Object.keys(accessoryQty).length === 0) {
    showMessage("Add at least one item before saving online");
    return;
  }

  const designName = window.prompt(
    "Enter a name for this online booth design:"
  );

  if (!designName) return;

  setOnlineSaving(true);
  setOnlineSaveUrl("");

  try {

    const shareUrl = await createOnlineDesignLink(designName);

    console.log("Saved online design URL:", shareUrl);

    setOnlineSaveUrl(shareUrl);

    await navigator.clipboard.writeText(shareUrl);
    trackEvent("design_saved_online", {
      booth_size: selectedBooth.label,
      booth_score: boothQuality.score,
      total_estimate: grandTotal,
    });
    showMessage("Online design link copied");

  } catch (error) {

    console.error("Online save failed:", error);

    showMessage("Online save failed");

  } finally {

    setOnlineSaving(false);

  }
};

const handleSaveDesign = () => {
  if (items.length === 0 && Object.keys(accessoryQty).length === 0) {
    showMessage("Add at least one item before saving");
    return;
  }

  const designName = window.prompt("Enter a name for this booth design:");

  if (!designName) return;

  const newDesign = {
    id: Date.now(),
    name: designName,
    savedAt: new Date().toISOString(),
    selectedBooth,
    boothType,
    adjacentAreas,
    items,
    accessoryQty,
  };

  const updatedDesigns = [newDesign, ...savedDesigns];

  setSavedDesigns(updatedDesigns);
  localStorage.setItem("boothDesigns", JSON.stringify(updatedDesigns));
  showMessage("Design saved successfully");
};

const handleLoadDesign = (designId) => {
  const design = savedDesigns.find((item) => item.id === Number(designId));

  if (!design) return;

  setSelectedBooth(design.selectedBooth);
  setBoothType(design.boothType || "Not Specified");
  setAdjacentAreas(design.adjacentAreas || BOOTH_TYPE_PRESETS["Not Specified"]);
  setItems(design.items || []);
  setAccessoryQty(design.accessoryQty || {});
  clearSelection();
  setHistory([]);
  setFuture([]);

  showMessage("Design loaded successfully");
};

const handleDeleteSavedDesign = (designId) => {
  const updatedDesigns = savedDesigns.filter(
    (item) => item.id !== Number(designId)
  );

  setSavedDesigns(updatedDesigns);
  localStorage.setItem("boothDesigns", JSON.stringify(updatedDesigns));
  showMessage("Saved design deleted");
};


const filteredProducts = SAMPLE_PRODUCTS.filter((product) => {
  const searchText = productSearch.toLowerCase().trim();

  if (!searchText) return true;

  return (
    product.name.toLowerCase().includes(searchText) ||
    product.category.toLowerCase().includes(searchText) ||
    product.keywords.toLowerCase().includes(searchText)
  );
});

const productsByCategory = filteredProducts.reduce((grouped, product) => {
  if (!grouped[product.category]) {
    grouped[product.category] = [];
  }

  grouped[product.category].push(product);
  return grouped;
}, {});

const toggleCategory = (category) => {
  setCollapsedCategories((prev) => ({
    ...prev,
    [category]: !prev[category],
  }));
};

const collapseAllCategories = () => {
  const nextState = {};

  Object.keys(productsByCategory).forEach((category) => {
    nextState[category] = true;
  });

  setCollapsedCategories(nextState);
};

const openProductDetails = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

useEffect(() => {
  if (!canvasWrapRef.current) return;

  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];

    setCanvasSize({
      width: entry.contentRect.width,
      height: entry.contentRect.height,
    });
  });

  resizeObserver.observe(canvasWrapRef.current);

  return () => resizeObserver.disconnect();
}, []);

useEffect(() => {
  const timer = window.setTimeout(() => {
    fitBoothToView();
  }, 50);

  return () => window.clearTimeout(timer);
}, [
  canvasSize.width,
  canvasSize.height,
  selectedBooth.width,
  selectedBooth.height,
  stageWidth,
  stageHeight,
  boothX,
  boothY,
  boothPixelWidth,
  boothPixelHeight,
  leftPanelOpen,
  rightPanelOpen,
]);

useEffect(() => {
  previousBoothOriginRef.current = { x: boothX, y: boothY };
}, [boothX, boothY]);

useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      setIsSpacePressed(true);
    }
  };

  const handleKeyUp = (e) => {
    if (e.code === "Space") {
      setIsSpacePressed(false);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
}, []);

useEffect(() => {
  const loadDesignFromUrl = async () => {
    const params = new URLSearchParams(window.location.search);
    const designId = params.get("design");

    if (!designId) return;

    try {
      const { data, error } = await supabase
        .from("booth_designs")
        .select("*")
        .eq("id", designId)
        .single();

      if (error || !data) {
        console.error("Design load failed:", error);
        showMessage("Could not load shared design");
        return;
      }

      setSelectedBooth(data.booth_size || BOOTH_SIZES[0]);
      setBoothType(data.booth_type || "Not Specified");
      setAdjacentAreas(
        data.adjacent_areas || BOOTH_TYPE_PRESETS["Not Specified"]
      );
      setItems(data.items || []);
      setAccessoryQty(data.accessory_qty || {});
      clearSelection();
      setHistory([]);
      setFuture([]);
      setLoadedFromSupabase(true);
      showMessage("Shared design loaded from Supabase");
    } catch (error) {
      console.error("Shared design load failed:", error);
      showMessage("Could not load shared design");
    }
  };

  loadDesignFromUrl();
}, []);

useEffect(() => {

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 1100);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };

}, []);

useEffect(() => {
  trackEvent("booth_designer_loaded");

  const sendHeartbeat = async () => {
    try {
      await supabase.from("app_heartbeat").insert({
        source: "booth-designer-vercel",
      });
    } catch (error) {
      console.log("Supabase heartbeat failed", error);
    }
  };

  sendHeartbeat();
}, []);

return (
  <div className="app-shell">
    <button
      className={`left-panel-flap ${leftPanelOpen ? "open" : "closed"}`}
      onClick={() => setLeftPanelOpen((open) => !open)}
    >
      {leftPanelOpen ? "‹" : "›"}
    </button>

    <aside className={`left-panel ${leftPanelOpen ? "open" : "closed"}`}>

      <strong>
                    Trade Show Booth Designer
      </strong>

      <span className="planner-beta-tag">
          FREE TOOL
      </span>

      {loadedFromSupabase && (
        <div className="supabase-loaded-banner">
          Loaded from shared Supabase design link
        </div>
      )}

      {(loadedFromSupabase || onlineSaveUrl) && (
        <button
          type="button"
          className="start-new-design-button"
          onClick={handleStartNewDesign}
        >
          Start New Design
        </button>
      )}

      <label className="field-label">Booth Size</label>
      <select
        value={selectedBooth.label}
        onChange={(e) => {
          const booth = BOOTH_SIZES.find(
            (item) => item.label === e.target.value
          );

          if (!booth) return;

          const { updatedItems, overflowCount } =
            moveOverflowItemsToOuterCanvas(booth);

          setSelectedBooth(booth);
          updateItemsWithHistory(updatedItems);
          clearSelection();

          if (overflowCount > 0) {
            showMessage(
              `${overflowCount} item${
                overflowCount > 1 ? "s were" : " was"
              } moved outside the booth because it no longer fits.`
            );
          }
        }}
      >
        {BOOTH_SIZES.map((booth) => (
          <option key={booth.label} value={booth.label}>
            {booth.label}
          </option>
        ))}

        {!BOOTH_SIZES.some(
          (booth) => booth.label === selectedBooth.label
        ) && (
          <option value={selectedBooth.label}>
            {selectedBooth.label}
          </option>
        )}
      </select>

      <label className="field-label" style={{ marginTop: 16 }}>
        Booth Type
      </label>

      <select
        value={boothType}
        onChange={(e) => handleBoothTypeChange(e.target.value)}
      >
        {BOOTH_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>


      <div className="product-list-panel">
        <div className="product-list-header">
          <strong>Products</strong>

          <button type="button" onClick={collapseAllCategories}>
            Collapse All
          </button>
        </div>

        <input
          className="product-search"
          type="text"
          placeholder="Search products..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
        />

        {Object.keys(productsByCategory).length === 0 ? (
          <p className="saved-empty">No products found.</p>
        ) : (

          Object.entries(productsByCategory).map(([category, products]) => {
            const hasSearch = productSearch.trim().length > 0;

            const isCollapsed = hasSearch
              ? false
              : collapsedCategories[category];

            return (

              <div className="product-category" key={category}>
                <button
                  type="button"
                  className="category-toggle"
                  onClick={() => toggleCategory(category)}
                >
                  <span>{category}</span>
                  <span>{isCollapsed ? "+" : "-"}</span>
                </button>

                {!isCollapsed && (
                  <div className="category-products">
                    {products.map((product) => (
                      <div className="product-card" key={product.id}>
                        <div className="product-card-image">
                          <img src={product.productImage} alt={product.name} />
                        </div>

                        <div className="product-card-body">
                          <strong>{product.name}</strong>

                          {product.attributes?.length > 0 ? (
                            <select
                              className="product-attribute-select"
                              value={
                                selectedProductAttributes[product.id] ||
                                product.attributes[0].label
                              }
                              onChange={(e) =>
                                setSelectedProductAttributes((prev) => ({
                                  ...prev,
                                  [product.id]: e.target.value,
                                }))
                              }
                            >
                              {product.attributes.map((attribute) => (
                                <option key={attribute.label} value={attribute.label}>
                                  {attribute.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span>
                              {product.dimensions?.widthFt || product.width}ft W x{" "}
                              {product.dimensions?.depthFt || product.height}ft D
                            </span>
                          )}

                          <span>
                            $
                            {(() => {
                              const selectedLabel =
                                selectedProductAttributes[product.id] ||
                                product.attributes?.[0]?.label;

                              const selectedAttr =
                                product.attributes?.find((attr) => attr.label === selectedLabel) ||
                                product.attributes?.[0];

                              return selectedAttr?.price ?? product.price;
                            })()}
                          </span>

                          {product.requiresProductId && (
                            <span>
                              Requires: {getProductById(product.requiresProductId)?.name}
                            </span>
                          )}
                        </div>

                        <div className="product-card-actions">
                          <button type="button" onClick={() => handleAddItem(product)}>
                            Add
                          </button>

                          <button
                            type="button"
                            onClick={() => openProductDetails(product.productUrl)}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>


      {selectedItemIds.length >= 2 && (
        <div className="alignment-tools">
          <h3>Align Selected</h3>

          <div className="alignment-grid">
            <button onClick={() => handleAlignSelected("left")}>Left</button>
            <button onClick={() => handleAlignSelected("center")}>Center</button>
            <button onClick={() => handleAlignSelected("right")}>Right</button>
            <button onClick={() => handleAlignSelected("top")}>Top</button>
            <button onClick={() => handleAlignSelected("middle")}>Middle</button>
            <button onClick={() => handleAlignSelected("bottom")}>Bottom</button>
          </div>

          <h3>Distribute</h3>

          <div className="alignment-grid">
            <button onClick={() => handleDistributeSelected("horizontal")}>
              Horizontal
            </button>
            <button onClick={() => handleDistributeSelected("vertical")}>
              Vertical
            </button>
          </div>
        </div>
      )}



    </aside>

            {message && (
              <div className="canvas-toast">
                {message}
              </div>
            )}

            <main className="canvas-section">
              <div className="toolbar">

                <div className="toolbar-booth-pill">
                  {selectedBooth.label} ft · {boothType}
                </div>

                <div className="top-action-toolbar">

                  <button
                    type="button"
                    title="Rotate Booth Orientation"
                    onClick={handleRotateBoothOrientation}
                  >
                    🔄
                    <span>Booth</span>
                  </button>


                  <button
                    type="button"
                    title="Undo"
                    disabled={history.length === 0}
                    onClick={handleUndo}
                  >
                    ↶
                    <span>Undo</span>
                  </button>

                  <button
                    type="button"
                    title="Redo"
                    disabled={future.length === 0}
                    onClick={handleRedo}
                  >
                    ↷
                    <span>Redo</span>
                  </button>

                  <span className="toolbar-divider"></span>

                  <button
                    type="button"
                    title="Rotate"
                    disabled={selectedItemIds.length === 0}
                    onClick={handleRotate}
                  >
                    ⟳
                    <span>Rotate</span>
                  </button>


                  <button
                    type="button"
                    title="Duplicate"
                    disabled={selectedItemIds.length === 0}
                    onClick={handleDuplicate}
                  >
                    ⧉
                    <span>Duplicate</span>
                  </button>

                  <button
                    type="button"
                    title="Lock / Unlock"
                    disabled={selectedItemIds.length === 0}
                    onClick={handleToggleLock}
                  >
                    🔒
                    <span>Lock</span>
                  </button>

                  <button
                    type="button"
                    title="Delete"
                    disabled={selectedItemIds.length === 0}
                    onClick={handleDelete}
                  >
                    🗑
                    <span>Delete</span>
                  </button>

                  <span className="toolbar-divider"></span>

                  <button
                    type="button"
                    title="Clear All"
                    disabled={items.length === 0}
                    onClick={handleClearAll}
                  >
                    🧹
                    <span>Clear</span>
                  </button>

                  <span className="toolbar-divider"></span>

                  <button
                    type="button"
                    title="Save Current Design"
                    disabled={items.length === 0 && Object.keys(accessoryQty).length === 0}
                    onClick={handleSaveDesign}
                  >
                    💾
                    <span>Save</span>
                  </button>

                  <div className="share-action-wrap">
                    <button
                      type="button"
                      title="Save Online & Copy Link"
                      disabled={
                        onlineSaving ||
                        (items.length === 0 && Object.keys(accessoryQty).length === 0)
                      }
                      onClick={async () => {
                        try {
                          if (!onlineSaveUrl) {
                            const shareUrl = await createOnlineDesignLink("Booth Design");

                            setOnlineSaveUrl(shareUrl);
                            showMessage("Online design link created");
                          }

                          setSharePopoverOpen(true);
                        } catch (error) {
                          console.error("Share popover save failed:", error);
                          showMessage("Could not create share link");
                        }
                      }}
                    >
                      🔗
                      <span>{onlineSaving ? "Saving" : "Share"}</span>
                    </button>

                    {sharePopoverOpen && (
                      <div className="share-popover">
                        <div className="share-popover-header">
                          <strong>Share Design</strong>

                          <button
                            type="button"
                            className="share-popover-close"
                            onClick={() => setSharePopoverOpen(false)}
                          >
                            ×
                          </button>
                        </div>

                        {onlineSaveUrl ? (
                          <>
                            <div className="share-popover-link">
                              {onlineSaveUrl}
                            </div>

                            <button
                              type="button"
                              className="share-popover-copy"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(onlineSaveUrl);
                                  showMessage("Copied");
                                  setSharePopoverOpen(false);
                                } catch (error) {
                                  console.error("Copy failed:", error);
                                  showMessage("Could not copy link");
                                }
                              }}
                            >
                              Copy Link
                            </button>
                          </>
                        ) : (
                          <p>Save online first to generate a shareable link.</p>
                        )}
                      </div>
                    )}
                  </div>

                </div>                

                  <div className="tool-mode-controls">
                    <button
                      className={canvasTool === "select" ? "active" : ""}
                      onClick={() => setCanvasTool("select")}
                    >
                      Select
                    </button>

                    <button
                      className={activeCanvasTool === "pan" ? "active" : ""}
                      onClick={() => setCanvasTool("pan")}
                    >
                      Pan
                    </button>
                  </div>

                  <div className="heatmap-toggle">
                    <button
                      className={showFlowHeatmap ? "active" : ""}
                      onClick={() => setShowFlowHeatmap((value) => !value)}
                    >
                      Flow Heatmap
                    </button>
                  </div>


                <div className="zoom-controls">
                  <button
                    onClick={() =>
                      setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.1).toFixed(2)))
                    }
                    >
                    -
                  </button>

                  <span>{Math.round(zoom * 100)}%</span>

                  <button
                    onClick={() =>
                      setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.1).toFixed(2)))
                    }
                  >
                    +
                  </button>

                  <button onClick={handleResetView}>
                    Reset
                  </button>
                </div>
              </div>

              <div className="floating-preview-panel">
                {selectedItem ? (
                  <>
                    <div className="floating-preview-top">
                      <div>
                        <strong className="floating-preview-title">
                          {selectedItem.name}
                        </strong>

                        <span className="floating-preview-attribute">
                          Size: {getItemRealDimensions(selectedItem).widthFt}×
                          {getItemRealDimensions(selectedItem).depthFt}
                        </span>
                      </div>

                      <div className="floating-preview-price-row">
                        <span className="floating-preview-price">
                          $ {selectedItem.price}
                        </span>

                        {selectedItem.productUrl && (
                          <button
                            type="button"
                            className="floating-preview-open"
                            onClick={() => openProductDetails(selectedItem.productUrl)}
                            title="Open product page"
                          >
                            ↗
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="floating-preview-image-wrap">
                      <img
                        src={selectedItem.productImage || selectedItem.image}
                        alt={selectedItem.name}
                        className="floating-preview-product-image"
                      />
                    </div>
                  </>
                ) : (
                  <div className="floating-preview-empty-card">
                    Add / Select Product on the Canvas
                  </div>
                )}
              </div>

              <div
                className={`canvas-wrap ${
                  activeCanvasTool === "pan" ? "pan-mode" : "select-mode"
                } ${isPanning ? "is-panning" : ""}`}
                ref={canvasWrapRef}
              >
                <Stage
                  ref={stageRef}
                  width={stageWidth}
                  height={stageHeight}
                  x={canvasPan.x}
                  y={canvasPan.y}
                  scaleX={zoom}
                  scaleY={zoom}
                  onWheel={handleWheelZoom}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
            >
          <Layer>
            <Rect
              name="canvas-background"
              x={0}
              y={0}
              width={stageWidth}
              height={stageHeight}
              fill="#f4f7fb"
            />

            <Group>
              <Text
                text="Top Measurement"
                x={boothX}
                y={boothY - 78}
                fontSize={13}
                fill="#6b7280"
              />

              <Text
                text="Left Measurement"
                x={boothX - 90}
                y={boothY + 110}
                fontSize={13}
                fill="#6b7280"
                rotation={-90}
              />

              <Rect
                x={boothX}
                y={boothY}
                width={boothPixelWidth}
                height={boothPixelHeight}
                fill="#ffffff"
                stroke="#1f2937"
                strokeWidth={2}
                shadowColor="rgba(15, 23, 42, 0.18)"
                shadowBlur={16}
                shadowOffset={{ x: 0, y: 8 }}
                shadowOpacity={0.35}
              />

              {/* Adjacent Areas */}
              <Group
                x={boothX}
                y={boothY - 34}
                onClick={() => handleAdjacentClick("top")}
                onTap={() => handleAdjacentClick("top")}
              >
                <Rect
                  width={boothPixelWidth}
                  height={24}
                  fill={ADJACENT_COLORS[adjacentAreas.top]}
                  stroke="#111827"
                  cornerRadius={6}
                />
                <Text
                  text={`Top: ${adjacentAreas.top}`}
                  width={boothPixelWidth}
                  y={5}
                  align="center"
                  fontSize={12}
                  fontStyle="bold"
                  fill="#111827"
                />
              </Group>

              <Group
                x={boothX}
                y={boothY + boothPixelHeight + 10}
                onClick={() => handleAdjacentClick("bottom")}
                onTap={() => handleAdjacentClick("bottom")}
              >
                <Rect
                  width={boothPixelWidth}
                  height={24}
                  fill={ADJACENT_COLORS[adjacentAreas.bottom]}
                  stroke="#111827"
                  cornerRadius={6}
                />
                <Text
                  text={`Bottom: ${adjacentAreas.bottom}`}
                  width={boothPixelWidth}
                  y={5}
                  align="center"
                  fontSize={12}
                  fontStyle="bold"
                  fill="#111827"
                />
              </Group>

              <Group
                x={boothX - ADJACENT_BAR_WIDTH - ADJACENT_GAP}
                y={boothY}
                onClick={() => handleAdjacentClick("left")}
                onTap={() => handleAdjacentClick("left")}
                >
                <Rect
                  width={ADJACENT_BAR_WIDTH}
                  height={boothPixelHeight}
                  fill={ADJACENT_COLORS[adjacentAreas.left]}
                  stroke="#111827"
                  cornerRadius={6}
                />

                <Text
                  text={`Left: ${adjacentAreas.left}`}
                  x={ADJACENT_BAR_WIDTH / 2}
                  y={boothPixelHeight / 2}
                  width={boothPixelHeight}
                  align="center"
                  rotation={-90}
                  offsetX={boothPixelHeight / 2}
                  offsetY={7}
                  fontSize={12}
                  fontStyle="bold"
                  fill="#111827"
                />
              </Group>

              <Group
                x={boothX + boothPixelWidth + ADJACENT_GAP}
                y={boothY}
                onClick={() => handleAdjacentClick("right")}
                onTap={() => handleAdjacentClick("right")}
                >
                <Rect
                  width={ADJACENT_BAR_WIDTH}
                  height={boothPixelHeight}
                  fill={ADJACENT_COLORS[adjacentAreas.right]}
                  stroke="#111827"
                  cornerRadius={6}
                />

                <Text
                  text={`Right: ${adjacentAreas.right}`}
                  x={ADJACENT_BAR_WIDTH / 2}
                  y={boothPixelHeight / 2}
                  width={boothPixelHeight}
                  align="center"
                  rotation={90}
                  offsetX={boothPixelHeight / 2}
                  offsetY={7}
                  fontSize={12}
                  fontStyle="bold"
                  fill="#111827"
                />
              </Group>

              {gridLines}
              {measurementLabels}
              {showFlowHeatmap &&
                flowHeatmapZones.map((zone, index) => (
                  <Rect
                    key={`flow-zone-${index}`}
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    fill={
                      zone.intensity === "high"
                        ? "rgba(239, 68, 68, 0.28)"
                        : "rgba(245, 158, 11, 0.22)"
                    }
                    cornerRadius={6}
                    listening={false}
                  />
                ))}

              <Text
                text={`${selectedBooth.label} Booth`}
                x={boothX + 12}
                y={boothY + 12}
                fontSize={15}
                fontStyle="bold"
                fill="#111827"
              />

              <Text
                text="Outer Canvas Area - items here are not counted"
                x={boothX + boothPixelWidth + ADJACENT_GAP + ADJACENT_BAR_WIDTH + 12}
                y={boothY - 30}
                fontSize={12}
                fill="#6b7280"
              />

              {selectionBox && (
                <Rect
                  x={selectionBox.x}
                  y={selectionBox.y}
                  width={selectionBox.width}
                  height={selectionBox.height}
                  fill="rgba(59, 130, 246, 0.12)"
                  stroke="#3b82f6"
                  strokeWidth={1}
                  dash={[4, 4]}
                />
              )}

              {alignmentGuides.map((guide, index) => {
                if (guide.type === "vertical") {
                  return (
                    <Line
                      key={`guide-v-${index}`}
                      points={[guide.x, 0, guide.x, stageHeight]}
                      stroke="#3b82f6"
                      strokeWidth={1}
                      dash={[6, 6]}
                    />
                  );
                }

                return (
                  <Line
                    key={`guide-h-${index}`}
                    points={[0, guide.y, stageWidth, guide.y]}
                    stroke="#3b82f6"
                    strokeWidth={1}
                    dash={[6, 6]}
                  />
                );
              })}

              {spacingGuides.map((guide, index) => {
                if (guide.type === "horizontal-gap") {
                  const midX = (guide.x1 + guide.x2) / 2;

                  return (
                    <Group key={`spacing-h-${index}`}>
                      <Line
                        points={[guide.x1, guide.y, guide.x2, guide.y]}
                        stroke="#111827"
                        strokeWidth={1}
                        dash={[4, 4]}
                      />
                      <Text
                        text={guide.label}
                        x={midX - 24}
                        y={guide.y - 18}
                        fontSize={11}
                        fill="#111827"
                        fontStyle="bold"
                      />
                    </Group>
                  );
                }

                const midY = (guide.y1 + guide.y2) / 2;

                return (
                  <Group key={`spacing-v-${index}`}>
                    <Line
                      points={[guide.x, guide.y1, guide.x, guide.y2]}
                      stroke="#111827"
                      strokeWidth={1}
                      dash={[4, 4]}
                    />
                    <Text
                      text={guide.label}
                      x={guide.x + 6}
                      y={midY - 6}
                      fontSize={11}
                      fill="#111827"
                      fontStyle="bold"
                    />
                  </Group>
                );
              })}


              {items.map((item) => {
                const size = getItemPixelSize(item);
                const isSelected = selectedItemIds.includes(item.instanceId);

                return (
                  <Group
                    key={item.instanceId}
                    x={item.x}
                    y={item.y}
                    draggable={!item.locked}
                    onMouseEnter={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = item.locked ? "not-allowed" : "move";
                    }}
                    onMouseLeave={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = "grab";
                    }}
                    onClick={(e) => handleSelectItem(e, item)}
                    onTap={(e) => handleSelectItem(e, item)}
                    onDragMove={(e) => {
                      if (hasMultiSelection && selectedItemIds.includes(item.instanceId)) {
                        handleGroupDragMove(e, item);
                        return;
                      }
                      const movingItem = {
                        ...item,
                        x: e.target.x(),
                        y: e.target.y(),
                      };

                      const snapped = getAlignmentGuides(movingItem, items);

                      const snappedItem = {
                        ...movingItem,
                        x: snapped.x,
                        y: snapped.y,
                      };

                      e.target.position({
                        x: snapped.x,
                        y: snapped.y,
                      });

                      setAlignmentGuides(snapped.guides);
                      setSpacingGuides(getSpacingGuides(snappedItem, items));
                    }}

                    onDragStart={() => {
                      setAlignmentGuides([]);
                      setSpacingGuides([]);
                      handleGroupDragStart(item);
                    }}
                    onDragEnd={(e) => {
                      handleGroupDragEnd(e, item);
                    }}
                  >

                  <BoothProduct
                    item={item}
                    size={size}
                    isSelected={isSelected}
                    invalidItemId={invalidItemId}
                    hasClearanceWarning={clearanceProblemItemIds.has(item.instanceId)}
                  />

                  </Group>
                );
              })}
            </Group>
          </Layer>
        </Stage>
      </div>
    </main>

    <aside className={`right-panel ${rightPanelOpen ? "open" : "closed"}`}>
      <button
        className="right-panel-flap"
        onClick={() => setRightPanelOpen((open) => !open)}
      >
        {itemBucketCount}
      </button>

      <div className="right-panel-inner">
        <button
          className="right-panel-done-btn"
          disabled={groupedBoothItems.length === 0}
          onClick={handleOpenFinalWindow}
        >
          Done → Download Booth
        </button>
        <div className="right-panel-header">
      
          <h2>Item Bucket</h2>
          <button onClick={() => setRightPanelOpen(false)}>×</button>
        </div>

        {groupedBoothItems.length === 0 ? (
          <div className="empty-bucket-card">
            <strong>No booth items yet</strong>
            <span>Add products from the left panel to build your booth quote.</span>
          </div>
        ) : (
          <div className="bucket-list">
            {groupedBoothItems.map((item) => (
              <div className="bucket-item" key={`${item.id}-${item.attribute}`}>
                <div className="bucket-thumb">
                  <img
                    src={item.productImage || item.image}
                    alt={item.name}
                    className="bucket-thumb-image"
                  />
                </div>
                <div className="bucket-info">
                  <strong>{item.name}</strong>
                  <span>{item.attribute}</span>
                  <span>Qty: {item.quantity}</span>
                </div>
                <div className="bucket-price">
                  ${item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="accessories-section">
          <h3>Accessories</h3>

          {ACCESSORIES.map((accessory) => (
            <div className="accessory-row" key={accessory.id}>
              <div>
                <strong>{accessory.name}</strong>
                <span>${accessory.price}</span>
              </div>

              <div className="qty-control">
                <button onClick={() => updateAccessoryQty(accessory.id, -1)}>
                  -
                </button>
                <span>{accessoryQty[accessory.id] || 0}</span>
                <button onClick={() => updateAccessoryQty(accessory.id, 1)}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="booth-score-card">
          <div className="booth-score-header">
            <span>Booth Quality Score</span>
            <strong>{boothQuality.score}/100</strong>
          </div>

          <div className="booth-score-bar">
            <div
              className={`booth-score-fill ${
                boothQuality.score >= 85
                  ? "excellent"
                  : boothQuality.score >= 70
                  ? "good"
                  : boothQuality.score >= 50
                  ? "needs-improvement"
                  : "poor"
              }`}
              style={{ width: `${boothQuality.score}%` }}
            />
          </div>

          <p>{boothQuality.status}</p>

          <ul>
            {boothQuality.feedback.slice(0, 3).map((note, index) => (
              <li key={`score-note-${index}`}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="utilization-card">
          <div className="utilization-header">
            <span>Booth Space Used</span>
            <strong>{utilizationPercent}%</strong>
          </div>

          <div className="utilization-bar">
            <div
              className={`utilization-fill ${
                utilizationStatus === "Comfortable"
                  ? "comfortable"
                  : utilizationStatus === "Moderate"
                  ? "moderate"
                  : "crowded"
              }`}
              style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            />
          </div>

          <p>{utilizationStatus}</p>
          {utilizationStatus === "Crowded" && (
            <div className="crowded-warning">
              This booth may feel crowded. Consider removing items or using a larger booth size.
            </div>
          )}
          {clearanceWarnings.length > 0 && (
            <div className="clearance-warning">
              <strong>Clearance Warning</strong>
              <span>{clearanceWarnings[0]}</span>
            </div>
          )}
          {placementSuggestions.length > 0 && (
            <div className="placement-suggestion">
              <strong>Placement Suggestion</strong>
              <span>{placementSuggestions[0]}</span>
            </div>
          )}
        </div>
        {showFlowHeatmap && flowHeatmapZones.length > 0 && (
          <div className="flow-summary">
            <strong>Visitor Flow Insight</strong>
            <span>
              Highlighted zones show areas where products may reduce open walking or demo space.
            </span>
          </div>
        )}


        <div className="bucket-total">
          <div>
            <span>Booth Items</span>
            <strong>${boothTotal}</strong>
          </div>
          <div>
            <span>Accessories</span>
            <strong>${accessoriesTotal}</strong>
          </div>
          <div className="grand-total">
            <span>Total Estimate</span>
            <strong>${grandTotal}</strong>
          </div>
        </div>
        <div className="estimate-disclaimer">
          Estimate shown is for planning only. Final pricing will be confirmed after artwork, specifications, and design review.
        </div>


      </div>
    </aside>
    {showLeadCapture && (
      <div className="lead-capture-overlay">
        <div className="lead-capture-modal">

          <button
            className="lead-capture-close"
            onClick={() => setShowLeadCapture(false)}
          >
            ×
          </button>

          <h2>Download Your Booth PDF</h2>

          <p className="lead-capture-subtext">
            Enter your details to generate your booth proposal PDF and receive expert booth setup recommendations.
          </p>

          <form
            className="lead-capture-form"
            onSubmit={handleLeadSubmit}
          >

            <label>
              Name *
              <input
                type="text"
                name="name"
                value={leadForm.name}
                onChange={handleLeadInputChange}
                placeholder="Your name"
              />
            </label>

            <label>
              Email *
              <input
                type="email"
                name="email"
                value={leadForm.email}
                onChange={handleLeadInputChange}
                placeholder="you@example.com"
              />
            </label>

            <label>
              Phone
              <input
                type="text"
                name="phone"
                value={leadForm.phone}
                onChange={handleLeadInputChange}
                placeholder="Phone number"
              />
            </label>

            <label>
              Company
              <input
                type="text"
                name="company"
                value={leadForm.company}
                onChange={handleLeadInputChange}
                placeholder="Company name"
              />
            </label>

            {leadError && (
              <div className="lead-capture-error">
                {leadError}
              </div>
            )}

            <button
              type="submit"
              className="lead-capture-submit"
              disabled={leadSaving}
            >
              {leadSaving
                ? "Preparing PDF..."
                : "Submit & Download PDF"}
            </button>

          </form>
        </div>
      </div>
    )}
    {finalWindowOpen && (
      <div className="final-overlay">
        <div className="final-popup" ref={finalContentRef}>
          <div className="final-header">
            <div>
              <h2>Your Booth Summary</h2>
              <p>
                Review your booth setup and download the PDF for quote discussion.
              </p>
            </div>

            <button
              className="final-close"
              onClick={() => setFinalWindowOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="final-top-row">
            <div className="booth-meta-card">
              <span>Booth Size</span>
              <strong>{selectedBooth.label} ft</strong>
            </div>

            <div className="booth-meta-card">
              <span>Booth Type</span>
              <strong>{boothType}</strong>
            </div>

            <div className="quote-message-card">
              <button
                className="final-download-btn"
                onClick={() => {
                  console.log("PDF button clicked");
                  handleDownloadButtonClick();
                }}
              >
                Download PDF
              </button>
              <p>
                For personalized quote, send the PDF to{" "}
                <strong>hello@printdrill.com</strong>
              </p>
            </div>
          </div>

          <section className="final-section">
            <h3>Booth Layout</h3>

            <div className="layout-snapshot-box">
              {layoutSnapshot ? (
                <img src={layoutSnapshot} alt="Booth layout snapshot" />
              ) : (
                <span>Booth layout snapshot will appear here.</span>
              )}
            </div>
          </section>

          <section className="final-section">
            <h3>Booth Components</h3>

            {Object.keys(groupedByCategory).length === 0 ? (
              <p className="empty-bucket">No booth components added yet.</p>
            ) : (
              Object.entries(groupedByCategory).map(([category, categoryItems]) => (
                <div className="final-category" key={category}>
                  <h4>{category}</h4>

                  <div className="final-table">
                    <div className="final-table-head">
                      <span>Item</span>
                      <span>Attribute</span>
                      <span>Qty</span>
                      <span>Estimate Price</span>
                      <span>Quote Price</span>
                      <span>% Discount</span>
                    </div>

                    {categoryItems.map((item) => (
                      <div className="final-table-row" key={`${category}-${item.id}`}>
                        <div className="final-item-cell">
                          <div
                            className="final-item-thumb"
                            style={{ background: item.color || "#d1d5db" }}
                          />
                          <strong>{item.name}</strong>
                        </div>

                        <span>{item.attribute || "Default"}</span>
                        <span>{item.quantity}</span>
                        <span>${item.price * item.quantity}</span>
                        <span className="blank-field"></span>
                        <span className="blank-field"></span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="final-score-section">
            <div>
              <span>Booth Quality Score</span>
              <strong>{boothQuality.score}/100</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{boothQuality.status}</strong>
            </div>

            <ul>
              {boothQuality.feedback.slice(0, 4).map((note, index) => (
                <li key={`final-score-note-${index}`}>{note}</li>
              ))}
            </ul>
          </section>

          <section className="final-utilization">
            <div>
              <span>Booth Space Used</span>
              <strong>{utilizationPercent}%</strong>
            </div>

            <div>
              <span>Used Area</span>
              <strong>{usedAreaSqFt} sq ft</strong>
            </div>

            <div>
              <span>Total Booth Area</span>
              <strong>{boothAreaSqFt} sq ft</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{utilizationStatus}</strong>
            </div>
          </section>

          {utilizationStatus === "Crowded" && (
            <div className="final-warning-box">
              <strong>Layout Warning</strong>
              <p>
                This booth uses more than 45% of available floor space. It may limit visitor
                movement, product demos, or lead capture space.
              </p>
            </div>
          )}

          {clearanceWarnings.length > 0 && (
            <div className="final-warning-box">
              <strong>Clearance Warning</strong>
              <p>{clearanceWarnings[0]}</p>
            </div>
          )}

          {placementSuggestions.length > 0 && (
            <div className="final-suggestion-box">
              <strong>Placement Suggestion</strong>
              <p>{placementSuggestions[0]}</p>
            </div>
          )}

          <section className="final-summary">
            <div>
              <span>Total Estimate</span>
              <strong>${grandTotal}</strong>
            </div>

            <div>
              <span>Quote Price</span>
              <span className="summary-blank-field"></span>
            </div>

            <div>
              <span>Discount %</span>
              <span className="summary-blank-field"></span>
            </div>
          </section>
        </div>
      </div>
    )}
  </div>
);
}

export default App;