import { useEffect, useMemo, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { Stage, Layer, Rect, Line, Text, Group, Circle } from "react-konva";
import "./App.css";

const SAMPLE_PRODUCTS = [
  {
    id: "p1",
    name: "Stretch Fabric Display",
    width: 10,
    height: 1,
    color: "#4B35FD",
    price: 120,
    category: "Backdrops",
    keywords: "fabric backdrop trade show display wall",
    productUrl: "https://www.printdrill.com/products/straight-pillow-case-tension-fabric-backdrop",
  },
  {
    id: "p2",
    name: "Deluxe Popup Counter",
    width: 4,
    height: 2,
    color: "#0169F5",
    price: 80,
    category: "Counter",
    keywords: "event table booth counter display table",
    productUrl: "https://www.printdrill.com/products/deluxe-popup-counter",
  },
  {
    id: "p3",
    name: "Full Printed Table Cover Throws",
    width: 3,
    height: 2,
    color: "#D4C830",
    price: 95,
    category: "Table Cover",
    keywords: "trade show table cover",
    productUrl: "https://www.printdrill.com/products/trade-show-printed-table-cover-throws",
  },
  {
    id: "p4",
    name: "Deluxe Wide Base Roll Up",
    width: 3,
    height: 1,
    color: "#8DFFDD",
    price: 65,
    category: "Standing Banners",
    keywords: "rollup banner retractable banner stand",
    productUrl: "https://www.printdrill.com/products/retractable-deluxe-wide-base-roll-up-banner",
  },
  {
    id: "p5",
    name: "SEG LightBox Display",
    width: 6,
    height: 1,
    color: "#DFDAFF",
    price: 220,
    category: "Lightboxes",
    keywords: "seg lightbox backlit display led booth",
    productUrl: "https://www.printdrill.com/products/seg-lightbox-display-10-ft",
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

function App() {
  const [selectedBooth, setSelectedBooth] = useState(BOOTH_SIZES[0]);
  const [zoom, setZoom] = useState(1);
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [message, setMessage] = useState("");
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [accessoryQty, setAccessoryQty] = useState({});
  const [savedDesigns, setSavedDesigns] = useState(() => {
    return JSON.parse(localStorage.getItem("boothDesigns") || "[]");
  });
  const [finalWindowOpen, setFinalWindowOpen] = useState(false);
  const [boothType, setBoothType] = useState("Not Specified");
  const [adjacentAreas, setAdjacentAreas] = useState(
    BOOTH_TYPE_PRESETS["Not Specified"]
  );
  const [productSearch, setProductSearch] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const stageRef = useRef(null);
  const finalContentRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const [layoutSnapshot, setLayoutSnapshot] = useState("");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [invalidItemId, setInvalidItemId] = useState(null);
  const [canvasSize, setCanvasSize] = useState({
    width: 900,
    height: 650,
  });

  const boothPixelWidth = selectedBooth.width * FEET_TO_PIXEL;
  const boothPixelHeight = selectedBooth.height * FEET_TO_PIXEL;

  const stageWidth = Math.max(canvasSize.width, boothPixelWidth + 240);
  const stageHeight = Math.max(canvasSize.height, boothPixelHeight + 220);

const boothX = Math.max(120, (stageWidth - boothPixelWidth) / 2);
const boothY = Math.max(120, (stageHeight - boothPixelHeight) / 2);

  const ADJACENT_BAR_WIDTH = 34;
  const ADJACENT_GAP = 10;

  const selectedItem = items.find((item) => item.instanceId === selectedItemId);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const snapToGrid = (value) =>
    Math.round(value / FEET_TO_PIXEL) * FEET_TO_PIXEL;

  const getItemPixelSize = (item) => {
    const isRotated = Math.abs(item.rotation % 180) === 90;

    return {
      width: (isRotated ? item.height : item.width) * FEET_TO_PIXEL,
      height: (isRotated ? item.width : item.height) * FEET_TO_PIXEL,
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
    const key = `${item.id}-default`;

    if (!grouped[key]) {
      grouped[key] = {
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        color: item.color,
        attribute: `${item.width}ft x ${item.height}ft`,
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
        stroke={i === 0 || i === selectedBooth.width ? "#111827" : "#d1d5db"}
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

const handleAddItem = (product) => {
  const productItem = {
    ...product,
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

  const position = findNearestFreeSpace(product, preferredX, preferredY);

  if (!position) {
    showMessage("No more space in the Booth Left to place the Item");
    return;
  }

  const newItem = {
    ...product,
    instanceId: Date.now(),
    x: position.x,
    y: position.y,
    rotation: 0,
    locked: false,
    placement: "booth",
  };

  updateItemsWithHistory([...items, newItem]);
  setSelectedItemId(newItem.instanceId);
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
  if (!selectedItem) return;

  if (selectedItem.locked) {
    showMessage("Unlock this item before deleting it");
    return;
  }

  updateItemsWithHistory(
    items.filter((item) => item.instanceId !== selectedItemId)
  );
  setSelectedItemId(null);
};

const handleRotate = () => {
  if (!selectedItem) return;

  if (selectedItem.locked) {
    showMessage("Unlock this item before rotating it");
    return;
  }

  const rotatedItem = {
    ...selectedItem,
    rotation: (selectedItem.rotation + 90) % 360,
  };

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
  if (!selectedItem) return;

  const size = getItemPixelSize(selectedItem);
  const candidate = {
    ...selectedItem,
    instanceId: Date.now(),
    x: selectedItem.x + FEET_TO_PIXEL,
    y: selectedItem.y + FEET_TO_PIXEL,
    placement: selectedItem.placement || "booth",
  };

  if (
    candidate.x + size.width > boothX + boothPixelWidth ||
    candidate.y + size.height > boothY + boothPixelHeight ||
    hasCollision(candidate)
  ) {
    const position = findNearestFreeSpace(selectedItem);
    if (!position) {
      showMessage("Not Enough Space in Booth");
      return;
    }

    candidate.x = position.x;
    candidate.y = position.y;
  }

  updateItemsWithHistory([...items, candidate]);
  setSelectedItemId(candidate.instanceId);
};

const handleToggleLock = () => {
  if (!selectedItem) return;

  updateItemsWithHistory(
    items.map((item) =>
      item.instanceId === selectedItem.instanceId
        ? { ...item, locked: !item.locked }
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

  setFinalWindowOpen(true);
};

const handleDownloadPDF = () => {
  if (!finalContentRef.current) return;

  const options = {
    margin: 0.35,
    filename: "printdrill-booth-summary.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: "in",
      format: "letter",
      orientation: "portrait",
    },
  };
  html2pdf().set(options).from(finalContentRef.current).save();
};

const handleUndo = () => {
  if (history.length === 0) return;

  const previousItems = history[history.length - 1];

  setFuture((prev) => [items, ...prev]);
  setItems(previousItems);
  setHistory((prev) => prev.slice(0, -1));
  setSelectedItemId(null);
};

const handleRedo = () => {
  if (future.length === 0) return;

  const nextItems = future[0];

  setHistory((prev) => [...prev, items]);
  setItems(nextItems);
  setFuture((prev) => prev.slice(1));
  setSelectedItemId(null);
};

const handleClearAll = () => {
  if (items.length === 0) return;

  updateItemsWithHistory([]);
  setSelectedItemId(null);
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
  setSelectedItemId(null);
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


return (
  <div className="app-shell">
    <button
      className={`left-panel-flap ${leftPanelOpen ? "open" : "closed"}`}
      onClick={() => setLeftPanelOpen((open) => !open)}
    >
      {leftPanelOpen ? "‹" : "›"}
    </button>

    <aside className={`left-panel ${leftPanelOpen ? "open" : "closed"}`}>

      <h2>Trade Show Booth Designer</h2>

      <p className="panel-note">
        Step 5: right panel item bucket, quantities, accessories, and total.
      </p>

      {message && <div className="inline-message">{message}</div>}

      <label className="field-label">Booth Size</label>
      <select
          onChange={(e) => {
            const booth = BOOTH_SIZES.find(
              (item) => item.label === e.target.value
            );

            const { updatedItems, overflowCount } = moveOverflowItemsToOuterCanvas(booth);

            setSelectedBooth(booth);
            updateItemsWithHistory(updatedItems);
            setSelectedItemId(null);

            if (overflowCount > 0) {
              showMessage(
                `${overflowCount} item${overflowCount > 1 ? "s were" : " was"} moved outside the booth because it no longer fits.`
              );
            }
          }}
      >
        {BOOTH_SIZES.map((booth) => (
          <option key={booth.label} value={booth.label}>
            {booth.label}
          </option>
        ))}
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


      <div className="info-box">
        <strong>Selected Booth</strong>
        <span>{selectedBooth.width} ft wide</span>
        <span>{selectedBooth.height} ft deep</span>
        <span>Type: {boothType}</span>
      </div>


      <div className="product-list-panel">
        <div className="product-list-header">
          <strong>Add Trade Show Items</strong>

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
                        <div
                          className="product-card-image"
                          style={{ background: product.color }}
                        />

                        <div className="product-card-body">
                          <strong>{product.name}</strong>
                          <span>
                            {product.width}ft x {product.height}ft
                          </span>
                          <span>${product.price}</span>
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


      <div className="action-grid">
        <button disabled={!selectedItem} onClick={handleRotate}>
          Rotate
        </button>
        <button disabled={!selectedItem} onClick={handleDuplicate}>
          Duplicate
        </button>
        <button disabled={!selectedItem} onClick={handleToggleLock}>
          {selectedItem?.locked ? "Unlock" : "Lock"}
        </button>
        <button disabled={!selectedItem} onClick={handleDelete}>
          Delete
        </button>
      </div>

      <div className="history-actions">
        <button disabled={history.length === 0} onClick={handleUndo}>
          Undo
        </button>

        <button disabled={future.length === 0} onClick={handleRedo}>
          Redo
        </button>

        <button disabled={items.length === 0} onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      <div className="save-load-panel">
        <h3>Save / Load Design</h3>

        <button
          className="save-design-button"
          onClick={handleSaveDesign}
          disabled={items.length === 0 && Object.keys(accessoryQty).length === 0}
        >
          Save Current Design
        </button>

        {savedDesigns.length === 0 ? (
          <p className="saved-empty">No saved designs yet.</p>
        ) : (
          <div className="saved-design-list">
            {savedDesigns.map((design) => (
              <div className="saved-design-row" key={design.id}>
                <div>
                  <strong>{design.name}</strong>
                  <span>
                    {new Date(design.savedAt).toLocaleDateString()} ·{" "}
                    {design.selectedBooth?.label || "Booth"}
                  </span>
                </div>

                <div className="saved-design-actions">
                  <button onClick={() => handleLoadDesign(design.id)}>Load</button>
                  <button onClick={() => handleDeleteSavedDesign(design.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className="preview-window">
        <h3>Product Preview</h3>

        {selectedItem ? (
          <div className="preview-content">
            <div
              className="preview-image"
              style={{ background: selectedItem.color }}
            />

           <div className="preview-details">
              <strong>{selectedItem.name}</strong>

              <span>
                Size: {selectedItem.width} ft x {selectedItem.height} ft
              </span>

              <span>Price: ${selectedItem.price}</span>

              <span>
                Status: {selectedItem.locked ? "Locked" : "Unlocked"}
              </span>

              <span>
                Bucket: {isInsideBooth(selectedItem) ? "Counted" : "Not Counted"}
              </span>
            </div>
          </div>
        ) : (
          <div className="preview-empty">
            Select a Product in Canvas to View
          </div>
        )}
      </div>
    </aside>

    <main className="canvas-section">
      <div className="toolbar">
        <div>
          <strong>Canvas</strong>
          <span className="muted">1 square = 1 ft</span>
        </div>

        <button
          className="done-button"
          disabled={groupedBoothItems.length === 0}
          onClick={handleOpenFinalWindow}
        >
          Done - Download Booth
        </button>

        <div className="zoom-controls">
          <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
            -
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))}>
            +
          </button>
        </div>
      </div>

      <div className="canvas-wrap" ref={canvasWrapRef}>
        <Stage
          ref={stageRef}
            width={stageWidth}
            height={stageHeight}
            scaleX={zoom}
            scaleY={zoom}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) {
              setSelectedItemId(null);
            }
          }}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              width={stageWidth}
              height={stageHeight}
              fill="#eef2ff"
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
                stroke="#111827"
                strokeWidth={2}
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

              <Text
                text={`Booth Area: ${selectedBooth.label} ft`}
                x={boothX + 12}
                y={boothY + 12}
                fontSize={16}
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

              {items.map((item) => {
                const size = getItemPixelSize(item);
                const isSelected = item.instanceId === selectedItemId;

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
                      container.style.cursor = "default";
                    }}
                    onClick={() => setSelectedItemId(item.instanceId)}
                    onTap={() => setSelectedItemId(item.instanceId)}
                    onDragEnd={(e) => handleDragEnd(e, item)}
                  >

                    <Rect
                      width={size.width}
                      height={size.height}
                      fill={invalidItemId === item.instanceId ? "#ef4444" : item.color}
                      cornerRadius={4}
                      opacity={item.locked ? 0.65 : 0.9}
                    />

                    <Text
                      text={`${item.name}${item.locked ? " 🔒" : ""}`}
                      x={6}
                      y={8}
                      fontSize={12}
                      fill="#ffffff"
                      fontStyle="bold"
                      width={size.width - 12}
                    />

                    {isSelected && (
                      <>
                        <Rect
                          x={-4}
                          y={-4}
                          width={size.width + 8}
                          height={size.height + 8}
                          stroke="#111827"
                          strokeWidth={2}
                          dash={[6, 4]}
                        />
                        <Circle x={0} y={0} radius={5} fill="#111827" />
                        <Circle x={size.width} y={0} radius={5} fill="#111827" />
                        <Circle x={0} y={size.height} radius={5} fill="#111827" />
                        <Circle
                          x={size.width}
                          y={size.height}
                          radius={5}
                          fill="#111827"
                        />
                      </>
                    )}
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
        <div className="right-panel-header">
          <h2>Item Bucket</h2>
          <button onClick={() => setRightPanelOpen(false)}>×</button>
        </div>

        {groupedBoothItems.length === 0 ? (
          <p className="empty-bucket">No booth items added yet.</p>
        ) : (
          <div className="bucket-list">
            {groupedBoothItems.map((item) => (
              <div className="bucket-item" key={`${item.id}-${item.attribute}`}>
                <div
                  className="bucket-thumb"
                  style={{ background: item.color }}
                />
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

        <button
          className="download-button"
          disabled={groupedBoothItems.length === 0}
          onClick={handleOpenFinalWindow}
        >
          Done - Download Booth
        </button>
      </div>
    </aside>
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
              <button className="pdf-button pdf-hide" onClick={handleDownloadPDF}>
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