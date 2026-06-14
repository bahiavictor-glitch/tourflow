import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardCheck,
  Eye,
  Hotel,
  Map,
  Mic2,
  Phone,
  Settings,
  Trash2,
  Wallet,
} from "lucide-react";
import "./App.css";

const modules = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Visão geral da produção, próximos shows e pendências críticas.",
    icon: CalendarDays,
  },
  {
    id: "shows",
    title: "Shows",
    description: "Cadastre datas, cidades, locais, horários e contratantes.",
    icon: CalendarDays,
  },
  {
    id: "routes",
    title: "Roteiros",
    description:
      "Organize saídas de Cruz das Almas, veículos, passageiros e retorno.",
    icon: Map,
  },
  {
    id: "technical",
    title: "Técnica",
    description:
      "Controle roadies, PA, monitor, rider, input list e mapa de palco.",
    icon: Mic2,
  },
  {
    id: "hospitality",
    title: "Hospitalidade",
    description: "Hotel, room list, alimentação, camarim, diárias e restrições.",
    icon: Hotel,
  },
  {
    id: "contacts",
    title: "Contatos",
    description: "Contratantes, contratados, banda, equipe técnica e fornecedores.",
    icon: Phone,
  },
  {
    id: "checklists",
    title: "Checklists",
    description: "Pré-produção, técnica, logística, dia do show e pós-show.",
    icon: ClipboardCheck,
  },
  {
    id: "finance",
    title: "Financeiro",
    description: "Receitas, despesas, cachês, saldos, pagamentos e resultado.",
    icon: Wallet,
  },
  {
    id: "settings",
    title: "Configurações",
    description: "Dados da turnê, banda, base de saída e preferências do sistema.",
    icon: Settings,
  },
];

const checklistPreview = [
  "Contrato assinado",
  "Hotel confirmado",
  "Transporte confirmado",
  "Rider técnico enviado",
  "Room list enviada",
  "Horário de saída confirmado",
];


const emptyShowForm = {
  eventName: "",
  city: "",
  venueName: "",
  venueAddress: "",
  showDate: "",
  showTime: "",
  arrivalTime: "",
  soundcheckTime: "",
  contractor: "",
  status: "pre-producao",
  notes: "",
};


const emptyRouteForm = {
  routeName: "",
  routeType: "van-banda",
  direction: "ida",
  destinationCity: "",
  showLocation: "",
  departureDate: "",
  departureTime: "",
  estimatedArrival: "",
  vehicle: "",
  driver: "",
  plate: "",
  passengers: "",
  stops: "",
  notes: "",
};


const emptyTechnicalForm = {
  paEngineer: "",
  monitorEngineer: "",
  roadie1: "",
  roadie2: "",
  lightOperator: "",
  stageProducer: "",
  soundCompany: "",
  lightCompany: "",
  printSoundCompany: true,
  printLightCompany: true,
  localTechnicalContact: "",
  riderSent: "nao",
  inputListSent: "nao",
  notes: "",
};


const emptyHospitalityForm = {
  hotelName: "",
  hotelContact: "",
  hotelAddress: "",
  checkIn: "",
  checkOut: "",
  roomCount: "",
  roomList: "",
  foodAllowance: "",
  printHotel: true,
  printFood: true,
};


const emptyContactForm = {
  group: "contratantes",
  name: "",
  role: "",
  phone: "",
  email: "",
  notes: "",
};


const emptyChecklistForm = {
  category: "pre-producao",
  task: "",
  responsible: "",
  deadline: "",
  priority: "normal",
  done: false,
};


const emptyFinanceForm = {
  fee: "",
  transportCost: "",
  hotelCost: "",
  foodCost: "",
  technicalCost: "",
  otherCost: "",
  notes: "",
};

const emptySettingsForm = {
  tourName: "",
  artistName: "Banda Acarajé com Camarão",
  baseCity: "Cruz das Almas",
  baseState: "BA",
  producerName: "",
  producerPhone: "",
  producerEmail: "",
  mainColor: "#fbbf24",
  secondaryColor: "#22c55e",
  logoUrl: "",
  notes: "",
};


const statusLabels = {
  "pre-producao": "Pré-produção",
  confirmado: "Confirmado",
  "em-andamento": "Em andamento",
  realizado: "Realizado",
  cancelado: "Cancelado",
};

const routeTypeLabels = {
  "van-banda": "Van Banda",
  "van-tecnica": "Van Técnica",
  "carro-producao": "Carro Produção",
  onibus: "Ônibus",
  outro: "Outro",
};


const directionLabels = {
  ida: "Ida",
  volta: "Volta",
  "ida-e-volta": "Ida e volta",
};


const contactGroupLabels = {
  contratantes: "Contratantes",
  contratados: "Contratados",
  banda: "Banda",
  tecnica: "Equipe técnica",
  fornecedores: "Fornecedores",
};

const checklistCategoryLabels = {
  "pre-producao": "Pré-produção",
  viagem: "Viagem",
  tecnica: "Técnica",
  hospitalidade: "Hospitalidade",
  financeiro: "Financeiro",
  "dia-do-show": "Dia do show",
};

const checklistPriorityLabels = {
  baixa: "Baixa",
  normal: "Normal",
  alta: "Alta",
  critica: "Crítica",
};


const defaultChecklistGroups = [
  {
    category: "pre-producao",
    title: "Pré-produção",
    items: [
      "Contrato assinado",
      "Sinal confirmado",
      "Nota fiscal emitida",
      "Divulgação alinhada",
    ],
  },
  {
    category: "tecnica",
    title: "Técnica",
    items: [
      "Rider enviado",
      "Input list enviado",
      "Mapa de palco enviado",
      "Passagem de som confirmada",
    ],
  },
  {
    category: "viagem",
    title: "Logística",
    items: [
      "Hotel confirmado",
      "Transporte confirmado",
      "Room list enviada",
      "Horário de saída confirmado",
    ],
  },
  {
    category: "dia-do-show",
    title: "Dia do show",
    items: [
      "Equipe avisada",
      "Chegada no local",
      "Passagem de som feita",
      "Retorno iniciado",
    ],
  },
];


function loadStoredShows() {
  try {
    const storedShows = localStorage.getItem("tourflow:shows");
    return storedShows ? JSON.parse(storedShows) : [];
  } catch {
    return [];
  }
}

function loadStoredRoutes() {
  try {
    const storedRoutes = localStorage.getItem("tourflow:routes");
    return storedRoutes ? JSON.parse(storedRoutes) : {};
  } catch {
    return {};
  }
}


function loadStoredTechnical() {
  try {
    const storedTechnical = localStorage.getItem("tourflow:technical");
    return storedTechnical ? JSON.parse(storedTechnical) : {};
  } catch {
    return {};
  }
}


function loadStoredHospitality() {
  try {
    const storedHospitality = localStorage.getItem("tourflow:hospitality");
    return storedHospitality ? JSON.parse(storedHospitality) : {};
  } catch {
    return {};
  }
}


function loadStoredContacts() {
  try {
    const storedContacts = localStorage.getItem("tourflow:contacts");
    return storedContacts ? JSON.parse(storedContacts) : [];
  } catch {
    return [];
  }
}


function loadStoredChecklists() {
  try {
    const storedChecklists = localStorage.getItem("tourflow:checklists");
    return storedChecklists ? JSON.parse(storedChecklists) : {};
  } catch {
    return {};
  }
}

function loadStoredFinance() {
  try {
    const storedFinance = localStorage.getItem("tourflow:finance");
    return storedFinance ? JSON.parse(storedFinance) : {};
  } catch {
    return {};
  }
}

function loadStoredSettings() {
  try {
    const storedSettings = localStorage.getItem("tourflow:settings");
    return storedSettings ? { ...emptySettingsForm, ...JSON.parse(storedSettings) } : emptySettingsForm;
  } catch {
    return emptySettingsForm;
  }
}

function normalizeImageUrl(url) {
  const trimmedUrl = String(url || "").trim();
  if (!trimmedUrl) return "";

  const driveFileMatch = trimmedUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveFileMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${driveFileMatch[1]}&sz=w1000`;
  }

  const driveOpenMatch = trimmedUrl.match(/[?&]id=([^&]+)/);
  if (trimmedUrl.includes("drive.google.com") && driveOpenMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${driveOpenMatch[1]}&sz=w1000`;
  }

  return trimmedUrl;
}

function parseMoneyValue(value) {
  const normalizedValue = String(value || "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.-]/g, "");

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function formatMoneyValue(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

function formatDisplayDate(dateValue) {
  if (!dateValue) return "A definir";

  const [year, month, day] = dateValue.split("-");
  if (!year || !month || !day) return "A definir";

  return `${day}/${month}/${year}`;
}

function App() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [shows, setShows] = useState(loadStoredShows);
  const [routesByShowId, setRoutesByShowId] = useState(loadStoredRoutes);
  const [technicalByShowId, setTechnicalByShowId] = useState(loadStoredTechnical);
  const [hospitalityByShowId, setHospitalityByShowId] = useState(loadStoredHospitality);
  const [contacts, setContacts] = useState(loadStoredContacts);
  const [checklistsByShowId, setChecklistsByShowId] = useState(loadStoredChecklists);
  const [financeByShowId, setFinanceByShowId] = useState(loadStoredFinance);
  const [settingsData, setSettingsData] = useState(loadStoredSettings);
  const [selectedShowId, setSelectedShowId] = useState("");

  const currentModule = useMemo(
    () => modules.find((module) => module.id === activeModule),
    [activeModule]
  );

  const sortedShows = useMemo(() => {
    return [...shows].sort((a, b) => {
      if (!a.showDate) return 1;
      if (!b.showDate) return -1;
      return (
        new Date(`${a.showDate}T${a.showTime || "00:00"}`) -
        new Date(`${b.showDate}T${b.showTime || "00:00"}`)
      );
    });
  }, [shows]);

  const nextShow = sortedShows.find(
    (show) => show.status !== "realizado" && show.status !== "cancelado"
  );

  const selectedShow =
    sortedShows.find((show) => show.id === selectedShowId) ||
    nextShow ||
    sortedShows[0];

  const dashboardStats = useMemo(
    () => [
      { label: "Shows cadastrados", value: String(shows.length) },
      {
        label: "Pendências abertas",
        value: String(shows.length ? checklistPreview.length : 0),
      },
      {
        label: "Roteiros criados",
        value: String(
          Object.values(routesByShowId).reduce((totalRoutes, showRoutes) => {
            if (Array.isArray(showRoutes)) return totalRoutes + showRoutes.length;
            return showRoutes ? totalRoutes + 1 : totalRoutes;
          }, 0)
        ),
      },
      { label: "PDFs gerados", value: "0" },
    ],
    [shows.length, routesByShowId]
  );

  const appStyle = {
    "--accent-color": settingsData?.mainColor || "#fbbf24",
    "--secondary-color": settingsData?.secondaryColor || "#22c55e",
  };

  const activeArtistName = settingsData?.artistName || "Banda a definir";
  const activeProjectName = settingsData?.tourName || "Produção de Turnê";
  const activeLogoUrl = normalizeImageUrl(settingsData?.logoUrl);

  const moduleHeaders = {
    dashboard: {
      eyebrow: activeProjectName,
      title: activeArtistName,
      description: "Painel central para acompanhar agenda, próximo show, pendências e atalhos da produção.",
      actionLabel: "Cadastrar show",
      actionModule: "shows",
    },
    shows: {
      eyebrow: "Agenda da produção",
      title: "Shows e datas",
      description: "Cadastre eventos, cidades, locais, horários, contratantes e status de cada apresentação.",
      actionLabel: "Ver Dashboard",
      actionModule: "dashboard",
    },
    routes: {
      eyebrow: "Logística de viagem",
      title: "Roteiros e transportes",
      description: "Monte roteiros de ida e volta, vans, motoristas, passageiros, horários de saída e previsão de chegada.",
      actionLabel: "Novo show",
      actionModule: "shows",
    },
    technical: {
      eyebrow: "Produção técnica",
      title: "Palco, som, luz e equipe técnica",
      description: "Organize PA, monitor, roadies, rider, input list, empresas técnicas e contatos locais.",
      actionLabel: "Gerenciar contatos",
      actionModule: "contacts",
    },
    hospitality: {
      eyebrow: "Hospitalidade",
      title: "Hotel, room list e alimentação",
      description: "Centralize hospedagem, check-in, check-out, quartos, room list e diária de alimentação.",
      actionLabel: "Ver roteiros",
      actionModule: "routes",
    },
    contacts: {
      eyebrow: "Rede da produção",
      title: "Contatos operacionais",
      description: "Organize contratantes, contratados, banda, equipe técnica, fornecedores e contatos importantes.",
      actionLabel: "Ver técnica",
      actionModule: "technical",
    },
    checklists: {
      eyebrow: "Controle de execução",
      title: "Checklists por show",
      description: "Acompanhe tarefas padrão de pré-produção, técnica, logística e dia do show.",
      actionLabel: "Ver Dashboard",
      actionModule: "dashboard",
    },
    finance: {
      eyebrow: "Resultado financeiro",
      title: "Receitas, custos e lucro estimado",
      description: "Lance cachês, transporte, hotel, alimentação, técnica, outros custos e acompanhe o resultado por show.",
      actionLabel: "Ver shows",
      actionModule: "shows",
    },
    settings: {
      eyebrow: "Configurações globais",
      title: "Banda, identidade e preferências",
      description: "Defina a banda/artista atual, projeto, cidade base, gestor, logo e cores principais do sistema.",
      actionLabel: "Ver Dashboard",
      actionModule: "dashboard",
    },
  };

  const activeHeader = moduleHeaders[activeModule] || moduleHeaders.dashboard;

  useEffect(() => {
    localStorage.setItem("tourflow:shows", JSON.stringify(shows));
  }, [shows]);

  useEffect(() => {
    localStorage.setItem("tourflow:routes", JSON.stringify(routesByShowId));
  }, [routesByShowId]);

  useEffect(() => {
    localStorage.setItem("tourflow:technical", JSON.stringify(technicalByShowId));
  }, [technicalByShowId]);

  useEffect(() => {
    localStorage.setItem("tourflow:hospitality", JSON.stringify(hospitalityByShowId));
  }, [hospitalityByShowId]);

  useEffect(() => {
    localStorage.setItem("tourflow:contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("tourflow:checklists", JSON.stringify(checklistsByShowId));
  }, [checklistsByShowId]);

  useEffect(() => {
    localStorage.setItem("tourflow:finance", JSON.stringify(financeByShowId));
  }, [financeByShowId]);

  useEffect(() => {
    localStorage.setItem("tourflow:settings", JSON.stringify(settingsData));
  }, [settingsData]);

  function handleCreateShow(showData) {
    const newShow = {
      ...showData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setShows((currentShows) => [...currentShows, newShow]);
    setSelectedShowId(newShow.id);
    setActiveModule("dashboard");
  }

  function handleOpenShow(showId, moduleId = "routes") {
    setSelectedShowId(showId);
    setActiveModule(moduleId);
  }

  function handleDeleteShow(showId) {
    const shouldDelete = window.confirm("Deseja excluir este show da turnê?");

    if (!shouldDelete) return;

    setShows((currentShows) => currentShows.filter((show) => show.id !== showId));
    setRoutesByShowId((currentRoutes) => {
      const nextRoutes = { ...currentRoutes };
      delete nextRoutes[showId];
      return nextRoutes;
    });
    setTechnicalByShowId((currentTechnical) => {
      const nextTechnical = { ...currentTechnical };
      delete nextTechnical[showId];
      return nextTechnical;
    });
    setHospitalityByShowId((currentHospitality) => {
      const nextHospitality = { ...currentHospitality };
      delete nextHospitality[showId];
      return nextHospitality;
    });
    setChecklistsByShowId((currentChecklists) => {
      const nextChecklists = { ...currentChecklists };
      delete nextChecklists[showId];
      return nextChecklists;
    });
    setFinanceByShowId((currentFinance) => {
      const nextFinance = { ...currentFinance };
      delete nextFinance[showId];
      return nextFinance;
    });

    if (selectedShowId === showId) {
      setSelectedShowId("");
    }
  }

  function handleSaveRoute(showId, routeData) {
    if (!showId) return;

    setRoutesByShowId((currentRoutes) => {
      const currentShowRoutes = Array.isArray(currentRoutes[showId])
        ? currentRoutes[showId]
        : currentRoutes[showId]
          ? [{ ...currentRoutes[showId], id: crypto.randomUUID() }]
          : [];

      const routeId = routeData.id || crypto.randomUUID();
      const nextRoute = {
        ...routeData,
        id: routeId,
        updatedAt: new Date().toISOString(),
      };

      const routeExists = currentShowRoutes.some((route) => route.id === routeId);

      return {
        ...currentRoutes,
        [showId]: routeExists
          ? currentShowRoutes.map((route) => (route.id === routeId ? nextRoute : route))
          : [...currentShowRoutes, nextRoute],
      };
    });
  }

  function handleDeleteRoute(showId, routeId) {
    if (!showId || !routeId) return;

    setRoutesByShowId((currentRoutes) => {
      const currentShowRoutes = Array.isArray(currentRoutes[showId])
        ? currentRoutes[showId]
        : [];

      const nextShowRoutes = currentShowRoutes.filter((route) => route.id !== routeId);
      const nextRoutes = { ...currentRoutes };

      if (nextShowRoutes.length) {
        nextRoutes[showId] = nextShowRoutes;
      } else {
        delete nextRoutes[showId];
      }

      return nextRoutes;
    });
  }

  function handleSaveTechnical(showId, technicalData) {
    if (!showId) return;

    setTechnicalByShowId((currentTechnical) => ({
      ...currentTechnical,
      [showId]: {
        ...technicalData,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function handleSaveHospitality(showId, hospitalityData) {
    if (!showId) return;

    setHospitalityByShowId((currentHospitality) => ({
      ...currentHospitality,
      [showId]: {
        ...hospitalityData,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function handleSaveContact(contactData) {
    const contactId = contactData.id || crypto.randomUUID();

    setContacts((currentContacts) => {
      const contactExists = currentContacts.some((contact) => contact.id === contactId);
      const nextContact = {
        ...contactData,
        id: contactId,
        updatedAt: new Date().toISOString(),
      };

      return contactExists
        ? currentContacts.map((contact) => (contact.id === contactId ? nextContact : contact))
        : [...currentContacts, nextContact];
    });
  }

  function handleDeleteContact(contactId) {
    const shouldDelete = window.confirm("Deseja excluir este contato?");

    if (!shouldDelete) return;

    setContacts((currentContacts) => currentContacts.filter((contact) => contact.id !== contactId));
  }

  function handleSaveChecklistItem(showId, checklistData) {
    if (!showId) return;

    const checklistItemId = checklistData.id || crypto.randomUUID();

    setChecklistsByShowId((currentChecklists) => {
      const currentShowChecklist = Array.isArray(currentChecklists[showId])
        ? currentChecklists[showId]
        : [];
      const itemExists = currentShowChecklist.some((item) => item.id === checklistItemId);
      const nextItem = {
        ...checklistData,
        id: checklistItemId,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...currentChecklists,
        [showId]: itemExists
          ? currentShowChecklist.map((item) => (item.id === checklistItemId ? nextItem : item))
          : [...currentShowChecklist, nextItem],
      };
    });
  }

  function handleDeleteChecklistItem(showId, checklistItemId) {
    if (!showId || !checklistItemId) return;

    const shouldDelete = window.confirm("Deseja excluir esta tarefa?");

    if (!shouldDelete) return;

    setChecklistsByShowId((currentChecklists) => {
      const currentShowChecklist = Array.isArray(currentChecklists[showId])
        ? currentChecklists[showId]
        : [];
      const nextShowChecklist = currentShowChecklist.filter((item) => item.id !== checklistItemId);
      const nextChecklists = { ...currentChecklists };

      if (nextShowChecklist.length) {
        nextChecklists[showId] = nextShowChecklist;
      } else {
        delete nextChecklists[showId];
      }

      return nextChecklists;
    });
  }

  function handleToggleChecklistItem(showId, checklistItemId) {
    if (!showId || !checklistItemId) return;

    setChecklistsByShowId((currentChecklists) => {
      const currentShowChecklist = Array.isArray(currentChecklists[showId])
        ? currentChecklists[showId]
        : [];

      return {
        ...currentChecklists,
        [showId]: currentShowChecklist.map((item) =>
          item.id === checklistItemId
            ? { ...item, done: !item.done, updatedAt: new Date().toISOString() }
            : item
        ),
      };
    });
  }

  function handleSaveFinance(showId, financeData) {
    if (!showId) return;

    setFinanceByShowId((currentFinance) => ({
      ...currentFinance,
      [showId]: {
        ...financeData,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function handleSaveSettings(nextSettingsData) {
    const savedSettingsData = {
      ...emptySettingsForm,
      ...nextSettingsData,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("tourflow:settings", JSON.stringify(savedSettingsData));
    setSettingsData(savedSettingsData);
  }

  return (
    <div className="app-shell" style={appStyle}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            {activeLogoUrl ? (
              <img src={activeLogoUrl} alt={activeArtistName} referrerPolicy="no-referrer" />
            ) : (
              "TF"
            )}
          </div>
          <div>
            <h1>{activeArtistName}</h1>
            <p>{activeProjectName}</p>
          </div>
        </div>

        <nav className="nav" aria-label="Navegação principal">
          {modules.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeModule;

            return (
              <button
                key={item.id}
                className={isActive ? "nav-item active" : "nav-item"}
                type="button"
                onClick={() => setActiveModule(item.id)}
              >
                <Icon size={18} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="main">
        <header className="hero">
          <div>
            <span className="eyebrow">{activeHeader.eyebrow}</span>
            <h2>{activeHeader.title}</h2>
            <p>{activeHeader.description}</p>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() => setActiveModule(activeHeader.actionModule)}
          >
            {activeHeader.actionLabel}
          </button>
        </header>

        {activeModule === "dashboard" ? (
          <DashboardView
            dashboardStats={dashboardStats}
            nextShow={nextShow}
            shows={sortedShows}
            settingsData={settingsData}
            setActiveModule={setActiveModule}
            onOpenShow={handleOpenShow}
            onDeleteShow={handleDeleteShow}
          />
        ) : (
          <ModuleView
            activeModule={activeModule}
            shows={sortedShows}
            selectedShow={selectedShow}
            selectedShowId={selectedShowId}
            setSelectedShowId={setSelectedShowId}
            routesByShowId={routesByShowId}
            technicalByShowId={technicalByShowId}
            hospitalityByShowId={hospitalityByShowId}
            contacts={contacts}
            checklistsByShowId={checklistsByShowId}
            financeByShowId={financeByShowId}
            settingsData={settingsData}
            onCreateShow={handleCreateShow}
            onSaveRoute={handleSaveRoute}
            onDeleteRoute={handleDeleteRoute}
            onSaveTechnical={handleSaveTechnical}
            onSaveHospitality={handleSaveHospitality}
            onSaveContact={handleSaveContact}
            onDeleteContact={handleDeleteContact}
            onSaveChecklistItem={handleSaveChecklistItem}
            onDeleteChecklistItem={handleDeleteChecklistItem}
            onToggleChecklistItem={handleToggleChecklistItem}
            onSaveFinance={handleSaveFinance}
            onSaveSettings={handleSaveSettings}
          />
        )}
      </main>
    </div>
  );
}

function DashboardView({
  dashboardStats,
  nextShow,
  shows,
  settingsData,
  setActiveModule,
  onOpenShow,
  onDeleteShow,
}) {
  return (
    <>
      <section className="stats-grid" aria-label="Indicadores da turnê">
        {dashboardStats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel next-show">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Próximo show</span>
              <h3>{nextShow?.eventName || "Nenhum show cadastrado"}</h3>
            </div>
            <span className="status">
              {nextShow ? statusLabels[nextShow.status] : "Aguardando cadastro"}
            </span>
          </div>

          <div className="info-list">
            <div>
              <span>Banda</span>
              <strong>{settingsData?.artistName || "Banda a definir"}</strong>
            </div>
            <div>
              <span>Base da banda</span>
              <strong>{settingsData?.baseCity || "Cidade base"} - {settingsData?.baseState || "UF"}</strong>
            </div>
            <div>
              <span>Cidade do show</span>
              <strong>{nextShow?.city || "A definir"}</strong>
            </div>
            <div>
              <span>Data</span>
              <strong>{formatDisplayDate(nextShow?.showDate)}</strong>
            </div>
            <div>
              <span>Chegada</span>
              <strong>{nextShow?.arrivalTime || "A definir"}</strong>
            </div>
            <div>
              <span>Passagem de som</span>
              <strong>{nextShow?.soundcheckTime || "A definir"}</strong>
            </div>
          </div>

          <div className="actions">
            <button type="button" onClick={() => setActiveModule("shows")}>
              Criar show
            </button>
            <button
              type="button"
              onClick={() =>
                nextShow ? onOpenShow(nextShow.id, "routes") : setActiveModule("shows")
              }
            >
              Abrir produção
            </button>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Pendências críticas</span>
              <h3>Checklist geral</h3>
            </div>
          </div>

          <ul className="checklist-preview">
            {checklistPreview.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Agenda</span>
            <h3>Shows cadastrados</h3>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => setActiveModule("shows")}
          >
            Novo show
          </button>
        </div>

        {shows.length ? (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Evento</th>
                  <th>Cidade</th>
                  <th>Horário</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show) => (
                  <tr key={show.id}>
                    <td>{formatDisplayDate(show.showDate)}</td>
                    <td>{show.eventName}</td>
                    <td>{show.city || "A definir"}</td>
                    <td>{show.showTime || "A definir"}</td>
                    <td>
                      <span className="status compact">
                        {statusLabels[show.status]}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() => onOpenShow(show.id, "routes")}
                          aria-label={`Abrir produção de ${show.eventName}`}
                        >
                          <Eye size={15} />
                          Abrir
                        </button>
                        <button
                          type="button"
                          className="danger-action"
                          onClick={() => onDeleteShow(show.id)}
                          aria-label={`Excluir ${show.eventName}`}
                        >
                          <Trash2 size={15} />
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <strong>Nenhum show cadastrado ainda.</strong>
            <p>
              Cadastre o primeiro show para o Dashboard começar a acompanhar a
              turnê.
            </p>
          </div>
        )}
      </section>

      <section className="modules-grid" aria-label="Módulos do sistema">
        {modules
          .filter((item) => item.id !== "dashboard")
          .map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className="module-card module-button"
                type="button"
                onClick={() => setActiveModule(item.id)}
              >
                <Icon size={24} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </button>
            );
          })}
      </section>
    </>
  );
}

function ModuleView({
  activeModule,
  shows,
  selectedShow,
  selectedShowId,
  setSelectedShowId,
  routesByShowId,
  technicalByShowId,
  hospitalityByShowId,
  contacts,
  checklistsByShowId,
  financeByShowId,
  settingsData,
  onCreateShow,
  onSaveRoute,
  onDeleteRoute,
  onSaveTechnical,
  onSaveHospitality,
  onSaveContact,
  onDeleteContact,
  onSaveChecklistItem,
  onDeleteChecklistItem,
  onToggleChecklistItem,
  onSaveFinance,
  onSaveSettings,
}) {
  if (activeModule === "shows") {
    return <ShowsView shows={shows} onCreateShow={onCreateShow} />;
  }

  if (activeModule === "routes") {
    return (
      <RouteFormView
        shows={shows}
        selectedShow={selectedShow}
        selectedShowId={selectedShowId}
        setSelectedShowId={setSelectedShowId}
        routes={
          Array.isArray(routesByShowId?.[selectedShow?.id])
            ? routesByShowId[selectedShow.id]
            : routesByShowId?.[selectedShow?.id]
              ? [{ ...routesByShowId[selectedShow.id], id: crypto.randomUUID() }]
              : []
        }
        onSaveRoute={onSaveRoute}
        onDeleteRoute={onDeleteRoute}
        settingsData={settingsData}
      />
    );
  }

  if (activeModule === "technical") {
    return (
      <TechnicalFormView
        shows={shows}
        selectedShow={selectedShow}
        selectedShowId={selectedShowId}
        setSelectedShowId={setSelectedShowId}
        technicalData={technicalByShowId?.[selectedShow?.id] || emptyTechnicalForm}
        onSaveTechnical={onSaveTechnical}
        settingsData={settingsData}
      />
    );
  }

  if (activeModule === "hospitality") {
    return (
      <HospitalityFormView
        shows={shows}
        selectedShow={selectedShow}
        selectedShowId={selectedShowId}
        setSelectedShowId={setSelectedShowId}
        hospitalityData={hospitalityByShowId?.[selectedShow?.id] || emptyHospitalityForm}
        onSaveHospitality={onSaveHospitality}
        settingsData={settingsData}
      />
      
    );
  }

  if (activeModule === "contacts") {
    return (
      <ContactsView
        contacts={contacts}
        onSaveContact={onSaveContact}
        onDeleteContact={onDeleteContact}
      />
    );
  }

  if (activeModule === "checklists") {
    return (
      <ChecklistView
        shows={shows}
        selectedShow={selectedShow}
        selectedShowId={selectedShowId}
        setSelectedShowId={setSelectedShowId}
        checklistItems={checklistsByShowId?.[selectedShow?.id] || []}
        onSaveChecklistItem={onSaveChecklistItem}
        onDeleteChecklistItem={onDeleteChecklistItem}
        onToggleChecklistItem={onToggleChecklistItem}
      />
    );
  }

  if (activeModule === "finance") {
    return (
      <FinanceViewWithPdf
        shows={shows}
        selectedShow={selectedShow}
        selectedShowId={selectedShowId}
        setSelectedShowId={setSelectedShowId}
        financeData={financeByShowId?.[selectedShow?.id] || emptyFinanceForm}
        onSaveFinance={onSaveFinance}
        settingsData={settingsData}
      />
    );
  }

  return (
    <SettingsView
      settingsData={settingsData || emptySettingsForm}
      onSaveSettings={onSaveSettings}
    />
  );
}

function SettingsView({ settingsData, onSaveSettings }) {
  const [formData, setFormData] = useState({ ...emptySettingsForm, ...settingsData });
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    setFormData({ ...emptySettingsForm, ...settingsData });
  }, [settingsData]);

  const normalizedLogoUrl = normalizeImageUrl(formData.logoUrl);

  function updateField(field, value) {
    setFormData((currentFormData) => ({ ...currentFormData, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSaveSettings(formData);
    setSavedMessage("Configurações salvas e aplicadas ao Dashboard.");
  }


  return (
    <section className="form-layout">
      <article className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <span className="eyebrow">Configurações</span>
              <h3>Dados gerais da turnê</h3>
            </div>
          </div>
          <p className="panel-description">
            Defina qual banda ou artista está sendo produzido agora. Essas informações são gerais do sistema e não ficam vinculadas a nenhum show específico.
          </p>

          {savedMessage ? <div className="save-message">{savedMessage}</div> : null}

          <div className="form-grid">
            <label>
              Projeto / temporada
              <input
                value={formData.tourName}
                onChange={(event) => updateField("tourName", event.target.value)}
                placeholder="Ex: São João 2026, Verão 2026, Turnê Nordeste..."
              />
            </label>
            <label>
              Banda / artista atual
              <input
                value={formData.artistName}
                onChange={(event) => updateField("artistName", event.target.value)}
                placeholder="Nome da banda ou artista"
              />
            </label>
            <label>
              Cidade base da banda
              <input
                value={formData.baseCity}
                onChange={(event) => updateField("baseCity", event.target.value)}
                placeholder="Cidade principal da banda"
              />
            </label>
            <label>
              Estado
              <input
                value={formData.baseState}
                onChange={(event) => updateField("baseState", event.target.value)}
                placeholder="UF"
              />
            </label>
            <label>
              Produtor / gestor atual
              <input
                value={formData.producerName}
                onChange={(event) => updateField("producerName", event.target.value)}
                placeholder="Nome do responsável pela produção"
              />
            </label>
            <label>
              Telefone da produção
              <input
                value={formData.producerPhone}
                onChange={(event) => updateField("producerPhone", event.target.value)}
                placeholder="WhatsApp / telefone"
              />
            </label>
            <label>
              E-mail da produção
              <input
                type="email"
                value={formData.producerEmail}
                onChange={(event) => updateField("producerEmail", event.target.value)}
                placeholder="email@exemplo.com"
              />
            </label>
            <label>
              Cor principal
              <input
                type="color"
                value={formData.mainColor || "#fbbf24"}
                onChange={(event) => updateField("mainColor", event.target.value)}
              />
            </label>
            <label>
              Cor secundária
              <input
                type="color"
                value={formData.secondaryColor || "#22c55e"}
                onChange={(event) => updateField("secondaryColor", event.target.value)}
              />
            </label>
            <label className="full-field">
              Logo / imagem da banda
              <input
                value={formData.logoUrl}
                onChange={(event) => updateField("logoUrl", event.target.value)}
                placeholder="URL direta da imagem ou link compartilhado do Google Drive"
              />
            </label>
            <label className="full-field">
              Observações gerais
              <textarea
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Informações fixas da produção, padrão da equipe, observações da turnê..."
              />
            </label>
          </div>

          <div className="actions">
            <button type="submit">Salvar configurações</button>
          </div>
        </form>
      </article>

      <article className="panel side-panel settings-side-panel">
        <span className="eyebrow">Resumo</span>
        <h3>{formData.artistName || "Banda sem nome"}</h3>

        <div className="settings-preview-card">
          {normalizedLogoUrl ? (
            <img className="settings-logo-preview" src={normalizedLogoUrl} alt={formData.artistName || "Logo"} referrerPolicy="no-referrer" />
          ) : (
            <div className="settings-color-dot" style={{ background: `linear-gradient(135deg, ${formData.mainColor || "#fbbf24"}, ${formData.secondaryColor || "#22c55e"})` }} />
          )}
          <div>
            <strong>{formData.tourName || "Projeto/temporada a definir"}</strong>
            <span>{formData.baseCity || "Cidade base"} - {formData.baseState || "UF"}</span>
          </div>
        </div>

        <div className="mini-list settings-summary-list">
          <div className="mini-list-item">
            <strong>Gestor</strong>
            <span>{formData.producerName || "A definir"}</span>
          </div>
          <div className="mini-list-item">
            <strong>Telefone</strong>
            <span>{formData.producerPhone || "A definir"}</span>
          </div>
          <div className="mini-list-item">
            <strong>E-mail</strong>
            <span>{formData.producerEmail || "A definir"}</span>
          </div>
          <div className="mini-list-item">
            <strong>Cores</strong>
            <span>{formData.mainColor || "#fbbf24"} / {formData.secondaryColor || "#22c55e"}</span>
          </div>
          <div className="mini-list-item">
            <strong>Logo</strong>
            <span>{normalizedLogoUrl ? "URL cadastrada" : "A definir"}</span>
          </div>
        </div>
      </article>
    </section>
  );
}

function FinanceViewWithPdf({
  shows,
  selectedShow,
  selectedShowId,
  setSelectedShowId,
  financeData,
  onSaveFinance,
  settingsData,
}) {
  const [formData, setFormData] = useState(financeData || emptyFinanceForm);
  const [savedMessage, setSavedMessage] = useState("");
  const activeArtistName = settingsData?.artistName || "TourFlow";
  const activeMainColor = settingsData?.mainColor || "#f59e0b";
  const activeSecondaryColor = settingsData?.secondaryColor || "#22c55e";
  const activeLogoUrl = normalizeImageUrl(settingsData?.logoUrl);

  useEffect(() => {
    setFormData(financeData || emptyFinanceForm);
    setSavedMessage("");
  }, [financeData, selectedShow?.id]);

  function updateField(field, value) {
    setFormData((currentFormData) => ({ ...currentFormData, [field]: value }));
  }

  const totalRevenue = parseMoneyValue(formData.fee);
  const totalCosts =
    parseMoneyValue(formData.transportCost) +
    parseMoneyValue(formData.hotelCost) +
    parseMoneyValue(formData.foodCost) +
    parseMoneyValue(formData.technicalCost) +
    parseMoneyValue(formData.otherCost);
  const estimatedProfit = totalRevenue - totalCosts;

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedShow?.id) return;

    onSaveFinance(selectedShow.id, formData);
    setSavedMessage("Financeiro salvo para este show.");
  }

  function handleGenerateFinancePdf() {
    const showTitle = selectedShow?.eventName || "Show não selecionado";
    const showDate = formatDisplayDate(selectedShow?.showDate);
    const showCity = selectedShow?.city || "Cidade a definir";
    const showVenue = selectedShow?.venueName || "Local a definir";
    const pdfBrandName = activeArtistName;
    const pdfMainColor = activeMainColor;
    const pdfSecondaryColor = activeSecondaryColor;
    const pdfLogoUrl = activeLogoUrl;
    const pdfLogoMarkup = pdfLogoUrl ? `<img class="pdf-logo" src="${pdfLogoUrl}" alt="${pdfBrandName}" />` : `<div class="pdf-logo-fallback">TF</div>`;

    const financeRows = [
      ["Receita prevista", formatMoneyValue(totalRevenue)],
      ["Transporte", formatMoneyValue(parseMoneyValue(formData.transportCost))],
      ["Hotel", formatMoneyValue(parseMoneyValue(formData.hotelCost))],
      ["Alimentação", formatMoneyValue(parseMoneyValue(formData.foodCost))],
      ["Técnica", formatMoneyValue(parseMoneyValue(formData.technicalCost))],
      ["Outros custos", formatMoneyValue(parseMoneyValue(formData.otherCost))],
      ["Custos totais", formatMoneyValue(totalCosts)],
      ["Lucro estimado", formatMoneyValue(estimatedProfit)],
    ];

    const pdfWindow = window.open("", "_blank", "width=900,height=1100");

    if (!pdfWindow) return;

    pdfWindow.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Financeiro · ${showTitle}</title>
          <style>
            * { box-sizing: border-box; }
            @page { size: A4; margin: 10mm; }
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #111827;
              background: #ffffff;
              font-size: 10px;
            }
            header {
              display: grid;
              grid-template-columns: 58px minmax(0, 1fr) auto;
              align-items: flex-start;
              gap: 14px;
              padding-bottom: 10px;
              border-bottom: 3px solid ${pdfMainColor};
              margin-bottom: 10px;
            }
            .pdf-logo,
            .pdf-logo-fallback {
              width: 50px;
              height: 50px;
              border-radius: 11px;
              object-fit: cover;
              display: block;
              border: 1px solid ${pdfMainColor};
              background: linear-gradient(135deg, ${pdfMainColor}, ${pdfSecondaryColor});
            }
            .pdf-logo-fallback {
              display: grid;
              place-items: center;
              color: #111827;
              font-size: 13px;
              font-weight: 900;
              letter-spacing: -0.08em;
            }
            .eyebrow {
              margin: 0 0 4px;
              color: ${pdfMainColor};
              font-size: 8px;
              font-weight: 800;
              letter-spacing: 0.14em;
              text-transform: uppercase;
            }
            h1 {
              display: inline-block;
              margin: 0;
              padding: 6px 10px;
              border-radius: 10px;
              color: #111827;
              background: ${pdfMainColor}14;
              border: 1px solid ${pdfMainColor};
              font-size: 30px;
              line-height: 1.05;
            }
            .meta {
              display: inline-block;
              margin-top: 7px;
              padding: 6px 10px;
              border-radius: 999px;
              color: #111827;
              background: ${pdfSecondaryColor}22;
              border: 1px solid ${pdfMainColor};
              font-size: 14px;
              font-weight: 900;
            }
            .status-box {
              display: grid;
              gap: 4px;
              text-align: right;
              font-size: 9px;
              color: #374151;
            }
            .result-card {
              margin: 14px 0 10px;
              padding: 14px;
              border-radius: 12px;
              border: 1px solid ${pdfMainColor};
              background: linear-gradient(135deg, ${pdfMainColor}18, ${pdfSecondaryColor}22);
            }
            .result-card strong {
              display: block;
              color: ${pdfMainColor};
              font-size: 8px;
              letter-spacing: 0.12em;
              text-transform: uppercase;
            }
            .result-card span {
              display: block;
              margin-top: 4px;
              color: #111827;
              font-size: 26px;
              font-weight: 900;
              line-height: 1;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size: 11px;
            }
            th {
              padding: 8px;
              text-align: left;
              color: #111827;
              background: linear-gradient(135deg, ${pdfMainColor}, ${pdfSecondaryColor});
            }
            td {
              padding: 8px;
              border: 1px solid #d1d5db;
            }
            td:last-child {
              text-align: right;
              font-weight: 800;
            }
            .notes {
              margin-top: 12px;
              padding: 10px;
              border-radius: 8px;
              border: 1px solid #d1d5db;
              background: #f9fafb;
              white-space: pre-wrap;
            }
            .notes strong {
              display: block;
              margin-bottom: 5px;
              color: #374151;
              font-size: 8px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }
            footer {
              margin-top: 10px;
              padding-top: 6px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 8px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <header>
            ${pdfLogoMarkup}
            <div>
              <p class="eyebrow">${pdfBrandName} · Financeiro</p>
              <h1>${showTitle}</h1>
              <div class="meta">${showDate} · ${showCity} · ${showVenue}</div>
            </div>
            <div class="status-box">
              <strong>Resultado</strong>
              <span>${estimatedProfit < 0 ? "Prejuízo estimado" : "Lucro estimado"}</span>
            </div>
          </header>

          <section class="result-card">
            <strong>Lucro estimado</strong>
            <span>${formatMoneyValue(estimatedProfit)}</span>
          </section>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${financeRows.map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`).join("")}
            </tbody>
          </table>

          <section class="notes">
            <strong>Observações financeiras</strong>
            ${formData.notes || "Sem observações."}
          </section>

          <footer>Documento gerado pelo TourFlow.</footer>
        </body>
      </html>
    `);

    pdfWindow.document.close();
    pdfWindow.focus();
    pdfWindow.print();
  }

  return (
    <section className="form-layout">
      <article className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <span className="eyebrow">Financeiro</span>
              <h3>Receitas, custos e resultado</h3>
            </div>
          </div>
          <p className="panel-description">
            Lance receitas, custos e observações financeiras do show.
          </p>

          {shows.length ? (
            <div className="show-context-card">
              <label>
                Show vinculado
                <select
                  value={selectedShowId || selectedShow?.id || ""}
                  onChange={(event) => setSelectedShowId?.(event.target.value)}
                >
                  {shows.map((show) => (
                    <option key={show.id} value={show.id}>
                      {formatDisplayDate(show.showDate)} · {show.eventName} · {show.city || "Cidade a definir"}
                    </option>
                  ))}
                </select>
              </label>

              <div className="linked-show-summary">
                <strong>{selectedShow?.eventName || "Show não selecionado"}</strong>
                <span>
                  {selectedShow
                    ? `${formatDisplayDate(selectedShow.showDate)} · ${selectedShow.city || "Cidade a definir"}`
                    : "Cadastre um show para vincular estas informações."}
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-state compact-empty form-empty-warning">
              <strong>Nenhum show cadastrado.</strong>
              <p>Cadastre um show antes de preencher o financeiro.</p>
            </div>
          )}

          {savedMessage ? <div className="save-message">{savedMessage}</div> : null}

          <div className="form-grid">
            <label>
              Receita prevista (cachê)
              <input
                value={formData.fee}
                onChange={(event) => updateField("fee", event.target.value)}
                placeholder="Ex: 10.000"
                type="text"
                inputMode="decimal"
              />
            </label>
            <label>
              Transporte
              <input
                value={formData.transportCost}
                onChange={(event) => updateField("transportCost", event.target.value)}
                placeholder="Ex: 1.000"
                type="text"
                inputMode="decimal"
              />
            </label>
            <label>
              Hotel
              <input
                value={formData.hotelCost}
                onChange={(event) => updateField("hotelCost", event.target.value)}
                placeholder="Ex: 1.500"
                type="text"
                inputMode="decimal"
              />
            </label>
            <label>
              Alimentação
              <input
                value={formData.foodCost}
                onChange={(event) => updateField("foodCost", event.target.value)}
                placeholder="Ex: 800"
                type="text"
                inputMode="decimal"
              />
            </label>
            <label>
              Técnica
              <input
                value={formData.technicalCost}
                onChange={(event) => updateField("technicalCost", event.target.value)}
                placeholder="Ex: 900"
                type="text"
                inputMode="decimal"
              />
            </label>
            <label>
              Outros custos
              <input
                value={formData.otherCost}
                onChange={(event) => updateField("otherCost", event.target.value)}
                placeholder="Ex: 250"
                type="text"
                inputMode="decimal"
              />
            </label>
            <label className="full-field">
              Observações financeiras
              <textarea
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Observações sobre pagamentos, recibos, pendências..."
              />
            </label>
          </div>

          <div className="actions">
            <button type="submit" disabled={!selectedShow?.id}>Salvar financeiro</button>
            <button type="button" onClick={handleGenerateFinancePdf}>Gerar PDF financeiro</button>
          </div>
        </form>
      </article>

      <article className="panel side-panel">
        <span className="eyebrow">Resumo financeiro</span>
        <h3>{selectedShow?.eventName || "Sem show selecionado"}</h3>
        <div className="mini-list">
          <div className="mini-list-item">
            <strong>Receita prevista</strong>
            <span>{formatMoneyValue(totalRevenue)}</span>
          </div>
          <div className="mini-list-item">
            <strong>Custos totais</strong>
            <span>{formatMoneyValue(totalCosts)}</span>
          </div>
          <div className="mini-list-item">
            <strong>Lucro estimado</strong>
            <span>{formatMoneyValue(estimatedProfit)}</span>
          </div>
        </div>
      </article>
    </section>
  );
}
function TechnicalFormView({
  shows,
  selectedShow,
  selectedShowId,
  setSelectedShowId,
  technicalData,
  onSaveTechnical,
  settingsData,
}) {
  const [formData, setFormData] = useState(technicalData || emptyTechnicalForm);
  const [savedMessage, setSavedMessage] = useState("");
  const activeArtistName = settingsData?.artistName || "TourFlow";
  const activeMainColor = settingsData?.mainColor || "#f59e0b";
  const activeSecondaryColor = settingsData?.secondaryColor || "#22c55e";
  const activeLogoUrl = normalizeImageUrl(settingsData?.logoUrl);

  useEffect(() => {
    setFormData(technicalData || emptyTechnicalForm);
    setSavedMessage("");
  }, [technicalData, selectedShow?.id]);

  function updateField(field, value) {
    setFormData((currentFormData) => ({ ...currentFormData, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedShow?.id) return;

    onSaveTechnical(selectedShow.id, formData);
    setSavedMessage("Informações técnicas salvas para este show.");
  }

  function handleGenerateTechnicalPdf() {
    const showTitle = selectedShow?.eventName || "Show não selecionado";
    const showDate = formatDisplayDate(selectedShow?.showDate);
    const showCity = selectedShow?.city || "Cidade a definir";
    const showVenue = selectedShow?.venueName || "Local a definir";
    const pdfBrandName = activeArtistName;
    const pdfMainColor = activeMainColor;
    const pdfSecondaryColor = activeSecondaryColor;
    const pdfLogoUrl = activeLogoUrl;
    const pdfLogoMarkup = pdfLogoUrl ? `<img class="pdf-logo" src="${pdfLogoUrl}" alt="${pdfBrandName}" />` : `<div class="pdf-logo-fallback">TF</div>`;
    const soundCompanyCard =
      formData.printSoundCompany !== false
        ? `<div class="card"><strong>Empresa de som</strong><span>${formData.soundCompany || "A definir"}</span></div>`
        : "";
    const lightCompanyCard =
      formData.printLightCompany !== false
        ? `<div class="card"><strong>Empresa de luz</strong><span>${formData.lightCompany || "A definir"}</span></div>`
        : "";

    const pdfWindow = window.open("", "_blank", "width=900,height=1100");

    if (!pdfWindow) return;

    pdfWindow.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Técnica · ${showTitle}</title>
          <style>
            * { box-sizing: border-box; }
            @page { size: A4; margin: 10mm; }
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #111827;
              background: #ffffff;
              font-size: 10px;
            }
            header {
              display: grid;
              grid-template-columns: 58px minmax(0, 1fr) auto;
              align-items: flex-start;
              gap: 14px;
              padding-bottom: 10px;
              border-bottom: 3px solid ${pdfMainColor};
              margin-bottom: 10px;
            }
            .pdf-logo,
            .pdf-logo-fallback {
              width: 50px;
              height: 50px;
              border-radius: 11px;
              object-fit: cover;
              display: block;
              border: 1px solid ${pdfMainColor};
              background: linear-gradient(135deg, ${pdfMainColor}, ${pdfSecondaryColor});
            }
            .pdf-logo-fallback {
              display: grid;
              place-items: center;
              color: #111827;
              font-size: 13px;
              font-weight: 900;
              letter-spacing: -0.08em;
            }
            .eyebrow {
              margin: 0 0 4px;
              color: ${pdfMainColor};
              font-size: 8px;
              font-weight: 800;
              letter-spacing: 0.14em;
              text-transform: uppercase;
            }
            h1 {
              display: inline-block;
              margin: 0;
              padding: 6px 10px;
              border-radius: 10px;
              color: #111827;
              background: ${pdfMainColor}14;
              border: 1px solid ${pdfMainColor};
              font-size: 30px;
              line-height: 1.05;
            }
            .meta {
              display: inline-block;
              margin-top: 7px;
              padding: 6px 10px;
              border-radius: 999px;
              color: #111827;
              background: ${pdfSecondaryColor}22;
              border: 1px solid ${pdfMainColor};
              font-size: 14px;
              font-weight: 900;
            }
            .status-box {
              display: grid;
              gap: 4px;
              text-align: right;
              font-size: 9px;
              color: #374151;
            }
            .section-title {
              margin: 10px 0 6px;
              padding: 6px 8px;
              border-radius: 7px;
              background: linear-gradient(135deg, ${pdfMainColor}, ${pdfSecondaryColor});
              color: #111827;
              font-size: 12px;
              line-height: 1.1;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 5px;
            }
            .card {
              padding: 6px 7px;
              border: 1px solid #d1d5db;
              border-radius: 7px;
              background: #f9fafb;
              min-height: 42px;
            }
            .full { grid-column: 1 / -1; }
            .highlight {
              border-color: ${pdfMainColor};
              background: ${pdfMainColor}14;
            }
            strong {
              display: block;
              margin-bottom: 3px;
              color: #374151;
              font-size: 8px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }
            span {
              display: block;
              white-space: pre-wrap;
              font-size: 10px;
              line-height: 1.25;
            }
            .highlight span {
              color: #111827;
              font-size: 11px;
              font-weight: 800;
            }
            footer {
              margin-top: 10px;
              padding-top: 6px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 8px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <header>
            ${pdfLogoMarkup}
            <div>
              <p class="eyebrow">${pdfBrandName} · Produção técnica</p>
              <h1>${showTitle}</h1>
              <div class="meta">${showDate} · ${showCity} · ${showVenue}</div>
            </div>
            <div class="status-box">
              <strong>Documentos técnicos</strong>
              <span>Rider: ${formData.riderSent || "nao"}</span>
              <span>Input: ${formData.inputListSent || "nao"}</span>
            </div>
          </header>

          <h2 class="section-title">Equipe técnica</h2>
          <section class="grid">
            <div class="card"><strong>Técnico de PA</strong><span>${formData.paEngineer || "A definir"}</span></div>
            <div class="card"><strong>Técnico de monitor</strong><span>${formData.monitorEngineer || "A definir"}</span></div>
            <div class="card"><strong>Operador de luz</strong><span>${formData.lightOperator || "A definir"}</span></div>
            <div class="card"><strong>Roadie 1</strong><span>${formData.roadie1 || "A definir"}</span></div>
            <div class="card"><strong>Roadie 2</strong><span>${formData.roadie2 || "A definir"}</span></div>
            <div class="card"><strong>Produtor de palco</strong><span>${formData.stageProducer || "A definir"}</span></div>
          </section>

          <h2 class="section-title">Fornecedores e contato local</h2>
          <section class="grid">
            ${soundCompanyCard}
            ${lightCompanyCard}
            <div class="card"><strong>Responsável técnico local</strong><span>${formData.localTechnicalContact || "A definir"}</span></div>
            <div class="card full"><strong>Observações técnicas</strong><span>${formData.notes || "Sem observações"}</span></div>
          </section>

          <footer>Documento gerado pelo TourFlow.</footer>
        </body>
      </html>
    `);

    pdfWindow.document.close();
    pdfWindow.focus();
    pdfWindow.print();
  }

  return (
    <section className="form-layout">
      <article className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <span className="eyebrow">Informações técnicas</span>
              <h3>Equipe técnica e palco</h3>
            </div>
          </div>
          <p className="panel-description">
            Organize roadies, PA, monitor, rider, input list, luz e contato técnico local.
          </p>

          {shows.length ? (
            <div className="show-context-card">
              <label>
                Show vinculado
                <select
                  value={selectedShowId || selectedShow?.id || ""}
                  onChange={(event) => setSelectedShowId?.(event.target.value)}
                >
                  {shows.map((show) => (
                    <option key={show.id} value={show.id}>
                      {formatDisplayDate(show.showDate)} · {show.eventName} · {show.city || "Cidade a definir"}
                    </option>
                  ))}
                </select>
              </label>

              <div className="linked-show-summary">
                <strong>{selectedShow?.eventName || "Show não selecionado"}</strong>
                <span>
                  {selectedShow
                    ? `${formatDisplayDate(selectedShow.showDate)} · ${selectedShow.city || "Cidade a definir"}`
                    : "Cadastre um show para vincular estas informações."}
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-state compact-empty form-empty-warning">
              <strong>Nenhum show cadastrado.</strong>
              <p>Cadastre um show antes de preencher a técnica.</p>
            </div>
          )}

          {savedMessage ? <div className="save-message">{savedMessage}</div> : null}

          <div className="form-grid">
            <label>
              Técnico de PA
              <input
                value={formData.paEngineer}
                onChange={(event) => updateField("paEngineer", event.target.value)}
                placeholder="Nome e telefone"
              />
            </label>
            <label>
              Técnico de monitor
              <input
                value={formData.monitorEngineer}
                onChange={(event) => updateField("monitorEngineer", event.target.value)}
                placeholder="Nome e telefone"
              />
            </label>
            <label>
              Roadie 1
              <input
                value={formData.roadie1}
                onChange={(event) => updateField("roadie1", event.target.value)}
                placeholder="Nome e telefone"
              />
            </label>
            <label>
              Roadie 2
              <input
                value={formData.roadie2}
                onChange={(event) => updateField("roadie2", event.target.value)}
                placeholder="Nome e telefone"
              />
            </label>
            <label>
              Operador de luz
              <input
                value={formData.lightOperator}
                onChange={(event) => updateField("lightOperator", event.target.value)}
                placeholder="Nome e telefone"
              />
            </label>
            <label>
              Produtor de palco
              <input
                value={formData.stageProducer}
                onChange={(event) => updateField("stageProducer", event.target.value)}
                placeholder="Nome e telefone"
              />
            </label>
            <label>
              Empresa de som
              <input
                value={formData.soundCompany}
                onChange={(event) => updateField("soundCompany", event.target.value)}
                placeholder="Empresa / contato"
              />
              <span className="inline-check">
                <input
                  type="checkbox"
                  checked={formData.printSoundCompany !== false}
                  onChange={(event) => updateField("printSoundCompany", event.target.checked)}
                />
                Imprimir no PDF
              </span>
            </label>
            <label>
              Empresa de luz
              <input
                value={formData.lightCompany}
                onChange={(event) => updateField("lightCompany", event.target.value)}
                placeholder="Empresa / contato"
              />
              <span className="inline-check">
                <input
                  type="checkbox"
                  checked={formData.printLightCompany !== false}
                  onChange={(event) => updateField("printLightCompany", event.target.checked)}
                />
                Imprimir no PDF
              </span>
            </label>
            <label>
              Responsável técnico local
              <input
                value={formData.localTechnicalContact}
                onChange={(event) => updateField("localTechnicalContact", event.target.value)}
                placeholder="Nome, função e telefone"
              />
            </label>
            <label>
              Rider enviado?
              <select
                value={formData.riderSent}
                onChange={(event) => updateField("riderSent", event.target.value)}
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
                <option value="pendente">Pendente</option>
              </select>
            </label>
            <label>
              Input list enviado?
              <select
                value={formData.inputListSent}
                onChange={(event) => updateField("inputListSent", event.target.value)}
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
                <option value="pendente">Pendente</option>
              </select>
            </label>
            <label className="full-field">
              Observações técnicas
              <textarea
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Mapa de palco, energia, restrições, horários e alinhamentos técnicos"
              />
            </label>
          </div>

          <div className="actions">
            <button type="submit" disabled={!selectedShow?.id}>Salvar técnica</button>
            <button type="button" onClick={handleGenerateTechnicalPdf}>Gerar PDF técnico</button>
          </div>
        </form>
      </article>

      <article className="panel side-panel">
        <span className="eyebrow">Resumo técnico</span>
        <h3>{selectedShow?.eventName || "Sem show selecionado"}</h3>
        <div className="mini-list">
          <div className="mini-list-item">
            <strong>PA</strong>
            <span>{formData.paEngineer || "A definir"}</span>
          </div>
          <div className="mini-list-item">
            <strong>Monitor</strong>
            <span>{formData.monitorEngineer || "A definir"}</span>
          </div>
          <div className="mini-list-item">
            <strong>Som / Luz</strong>
            <span>
              {formData.printSoundCompany !== false ? formData.soundCompany || "Som a definir" : "Som oculto no PDF"} · {formData.printLightCompany !== false ? formData.lightCompany || "Luz a definir" : "Luz oculta no PDF"}
            </span>
          </div>
          <div className="mini-list-item">
            <strong>Rider / Input</strong>
            <span>Rider: {formData.riderSent} · Input: {formData.inputListSent}</span>
          </div>
        </div>
      </article>
    </section>
  );
}


function ShowsView({ shows, onCreateShow }) {
  const [formData, setFormData] = useState(emptyShowForm);
  const [formError, setFormError] = useState("");

  function updateField(field, value) {
    setFormData((currentFormData) => ({ ...currentFormData, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.eventName.trim()) {
      setFormError("Preencha o nome do evento para salvar o show.");
      return;
    }

    if (!formData.showDate) {
      setFormError("Preencha a data do show para organizar a agenda.");
      return;
    }

    onCreateShow(formData);
    setFormData(emptyShowForm);
    setFormError("");
  }

  return (
    <section className="form-layout">
      <article className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <span className="eyebrow">Cadastro de show</span>
              <h3>Novo show da turnê</h3>
            </div>
            <span className="status">{statusLabels[formData.status]}</span>
          </div>

          {formError ? <div className="form-error">{formError}</div> : null}

          <div className="form-grid">
            <label>
              Nome do evento
              <input
                value={formData.eventName}
                onChange={(event) => updateField("eventName", event.target.value)}
                placeholder="Ex: São João de Santo Antônio"
              />
            </label>
            <label>
              Cidade
              <input
                value={formData.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="Ex: Santo Antônio de Jesus"
              />
            </label>
            <label>
              Local
              <input
                value={formData.venueName}
                onChange={(event) => updateField("venueName", event.target.value)}
                placeholder="Praça, palco, casa de show..."
              />
            </label>
            <label>
              Endereço
              <input
                value={formData.venueAddress}
                onChange={(event) => updateField("venueAddress", event.target.value)}
                placeholder="Endereço completo"
              />
            </label>
            <label>
              Data
              <input
                type="date"
                value={formData.showDate}
                onChange={(event) => updateField("showDate", event.target.value)}
              />
            </label>
            <label>
              Horário do show
              <input
                type="time"
                value={formData.showTime}
                onChange={(event) => updateField("showTime", event.target.value)}
              />
            </label>
            <label>
              Chegada no local
              <input
                type="time"
                value={formData.arrivalTime}
                onChange={(event) => updateField("arrivalTime", event.target.value)}
              />
            </label>
            <label>
              Passagem de som
              <input
                type="time"
                value={formData.soundcheckTime}
                onChange={(event) => updateField("soundcheckTime", event.target.value)}
              />
            </label>
            <label>
              Contratante
              <input
                value={formData.contractor}
                onChange={(event) => updateField("contractor", event.target.value)}
                placeholder="Nome/empresa/prefeitura"
              />
            </label>
            <label>
              Status
              <select
                value={formData.status}
                onChange={(event) => updateField("status", event.target.value)}
              >
                <option value="pre-producao">Pré-produção</option>
                <option value="confirmado">Confirmado</option>
                <option value="em-andamento">Em andamento</option>
                <option value="realizado">Realizado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </label>
            <label className="full-field">
              Observações gerais
              <textarea
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Informações importantes do show"
              />
            </label>
          </div>

          <div className="actions">
            <button type="submit">Salvar show</button>
            <button type="button" onClick={() => setFormData(emptyShowForm)}>
              Limpar
            </button>
          </div>
        </form>
      </article>

      <article className="panel side-panel">
        <span className="eyebrow">Agenda atual</span>
        <h3>
          {shows.length} show{shows.length === 1 ? "" : "s"}
        </h3>
        <p>
          Depois que o show for salvo, ele aparece no Dashboard e poderá receber
          roteiro, técnica, hospitalidade, contatos, financeiro e checklist.
        </p>

        <div className="mini-list">
          {shows.length ? (
            shows.slice(0, 5).map((show) => (
              <div key={show.id} className="mini-list-item">
                <strong>{show.eventName}</strong>
                <span>
                  {formatDisplayDate(show.showDate)} · {show.city || "Cidade a definir"}
                </span>
              </div>
            ))
          ) : (
            <div className="empty-state compact-empty">
              <strong>Nenhum show salvo.</strong>
              <p>Use o formulário para iniciar a agenda da turnê.</p>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function RouteFormView({
  shows,
  selectedShow,
  selectedShowId,
  setSelectedShowId,
  routes = [],
  onSaveRoute,
  onDeleteRoute,
  settingsData,
}) {
  const [editingRouteId, setEditingRouteId] = useState("");
  const [formData, setFormData] = useState(emptyRouteForm);
  const [savedMessage, setSavedMessage] = useState("");
  const [selectedPdfRouteIds, setSelectedPdfRouteIds] = useState([]);
  const activeArtistName = settingsData?.artistName || "TourFlow";
  const activeBaseCity = settingsData?.baseCity || "Cidade base";
  const activeMainColor = settingsData?.mainColor || "#f59e0b";
  const activeSecondaryColor = settingsData?.secondaryColor || "#22c55e";
  const activeLogoUrl = normalizeImageUrl(settingsData?.logoUrl);

  useEffect(() => {
    const firstRoute = routes[0];

    setEditingRouteId(firstRoute?.id || "");
    setFormData(firstRoute || emptyRouteForm);
    setSelectedPdfRouteIds(routes.map((route) => route.id));
    setSavedMessage("");
  }, [routes, selectedShow?.id]);

  function updateField(field, value) {
    setFormData((currentFormData) => ({ ...currentFormData, [field]: value }));
  }

  function startNewRoute() {
    setEditingRouteId("");
    setFormData(emptyRouteForm);
    setSavedMessage("");
  }

  function editRoute(route) {
    setEditingRouteId(route.id);
    setFormData(route);
    setSavedMessage("");
  }

  function deleteRoute(routeId) {
    const shouldDelete = window.confirm("Deseja excluir este roteiro?");

    if (!shouldDelete || !selectedShow?.id) return;

    onDeleteRoute(selectedShow.id, routeId);
    startNewRoute();
  }

  function createPresetRoute(routeType, direction) {
    setEditingRouteId("");
    setFormData({
      ...emptyRouteForm,
      routeType,
      direction,
      routeName: `${routeTypeLabels[routeType]} · ${directionLabels[direction]}`,
      destinationCity: selectedShow?.city || "",
      showLocation: selectedShow?.venueName || "",
      departureDate: selectedShow?.showDate || "",
    });
    setSavedMessage("");
  }

  function togglePdfRoute(routeId) {
    setSelectedPdfRouteIds((currentIds) =>
      currentIds.includes(routeId)
        ? currentIds.filter((currentId) => currentId !== routeId)
        : [...currentIds, routeId]
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedShow?.id) return;

    const routeId = editingRouteId || crypto.randomUUID();

    onSaveRoute(selectedShow.id, {
      ...formData,
      id: routeId,
    });
    setEditingRouteId(routeId);
    setSavedMessage("Roteiro salvo para este show.");
  }

  function handleGenerateRoutePdf() {
    const selectedRoutes = routes.filter((route) => selectedPdfRouteIds.includes(route.id));
    const routesToPrint = selectedRoutes.length ? selectedRoutes : [formData];
    const showTitle = selectedShow?.eventName || "Show não selecionado";
    const showDate = formatDisplayDate(selectedShow?.showDate);
    const showCity = selectedShow?.city || "Cidade a definir";
    const pdfBrandName = activeArtistName;
    const pdfMainColor = activeMainColor;
    const pdfSecondaryColor = activeSecondaryColor;
    const pdfLogoUrl = activeLogoUrl;
    const pdfLogoMarkup = pdfLogoUrl ? `<img class="pdf-logo" src="${pdfLogoUrl}" alt="${pdfBrandName}" />` : `<div class="pdf-logo-fallback">TF</div>`;

    const routeSections = routesToPrint
      .map((route) => {
        const routeTitle = route.routeName || `${routeTypeLabels[route.routeType] || "Roteiro"} · ${directionLabels[route.direction] || "Ida"}`;
        return `
          <section class="route-section">
            <h2>${routeTitle}</h2>
            <div class="route-grid">
              <div class="highlight main-highlight"><strong>Data</strong><span>${formatDisplayDate(route.departureDate)}</span></div>
              <div class="highlight main-highlight"><strong>Horário</strong><span>${route.departureTime || "A definir"}</span></div>
              <div><strong>Tipo</strong><span>${routeTypeLabels[route.routeType] || "A definir"}</span></div>
              <div><strong>Sentido</strong><span>${directionLabels[route.direction] || "A definir"}</span></div>
              <div><strong>Previsão de chegada</strong><span>${route.estimatedArrival || "A definir"}</span></div>
              <div><strong>Veículo</strong><span>${route.vehicle || "A definir"}</span></div>
              <div><strong>Placa</strong><span>${route.plate || "A definir"}</span></div>
              <div class="full"><strong>Destino</strong><span>${route.destinationCity || showCity} · ${route.showLocation || selectedShow?.venueName || "Local a definir"}</span></div>
              <div class="full"><strong>Motorista</strong><span>${route.driver || "A definir"}</span></div>
              <div class="full"><strong>Passageiros</strong><span>${route.passengers || "A definir"}</span></div>
              <div class="full"><strong>Paradas / Observações</strong><span>${route.stops || "Sem paradas previstas"}${route.notes ? `\n${route.notes}` : ""}</span></div>
            </div>
          </section>
        `;
      })
      .join("");

    const pdfWindow = window.open("", "_blank", "width=900,height=1100");

    if (!pdfWindow) return;

    pdfWindow.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Roteiros · ${showTitle}</title>
          <style>
            * { box-sizing: border-box; }
            @page { size: A4; margin: 9mm; }
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #111827;
              background: #ffffff;
              font-size: 10px;
            }
            header {
              display: grid;
              grid-template-columns: 54px minmax(0, 1fr) auto;
              align-items: flex-start;
              gap: 12px;
              padding-bottom: 8px;
              border-bottom: 3px solid ${pdfMainColor};
              margin-bottom: 8px;
            }
            .pdf-logo,
            .pdf-logo-fallback {
              width: 46px;
              height: 46px;
              border-radius: 10px;
              object-fit: cover;
              display: block;
              border: 1px solid ${pdfMainColor};
              background: linear-gradient(135deg, ${pdfMainColor}, ${pdfSecondaryColor});
            }
            .pdf-logo-fallback {
              display: grid;
              place-items: center;
              color: #111827;
              font-size: 13px;
              font-weight: 900;
              letter-spacing: -0.08em;
            }
            .eyebrow {
              margin: 0 0 4px;
              color: ${pdfMainColor};
              font-size: 8px;
              font-weight: 800;
              letter-spacing: 0.14em;
              text-transform: uppercase;
            }
            h1 {
              margin: 0;
              font-size: 19px;
              line-height: 1.05;
            }
            .meta {
              display: inline-block;
              margin-top: 5px;
              padding: 4px 7px;
              border-radius: 999px;
              color: #111827;
              background: ${pdfSecondaryColor}22;
              border: 1px solid ${pdfMainColor};
              font-size: 10px;
              font-weight: 800;
            }
            .summary {
              text-align: right;
              color: #374151;
              font-size: 9px;
              line-height: 1.3;
            }
            .summary strong {
              margin-bottom: 2px;
              font-size: 10px;
            }
            .route-section {
              padding: 6px 0;
              border-bottom: 1px solid #e5e7eb;
              break-inside: avoid;
            }
            .route-section:last-child { border-bottom: 0; }
            h2 {
              margin: 0 0 5px;
              padding: 5px 7px;
              border-radius: 7px;
              background: linear-gradient(135deg, ${pdfMainColor}, ${pdfSecondaryColor});
              color: #111827;
              font-size: 12px;
              line-height: 1.1;
            }
            .route-grid {
              display: grid;
              grid-template-columns: repeat(4, minmax(0, 1fr));
              gap: 4px;
            }
            .route-grid div {
              padding: 5px 6px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              background: #f9fafb;
              min-height: 32px;
            }
            .route-grid .highlight {
              border-color: ${pdfMainColor};
              background: ${pdfMainColor}14;
            }
            .route-grid .highlight strong {
              color: ${pdfMainColor};
            }
            .route-grid .highlight span {
              color: #111827;
              font-size: 11px;
              font-weight: 800;
            }
            .route-grid .main-highlight {
              min-height: 44px;
            }
            .route-grid .main-highlight span {
              font-size: 13px;
              line-height: 1.15;
            }
            .route-grid .full { grid-column: 1 / -1; }
            strong {
              display: block;
              margin-bottom: 2px;
              color: #374151;
              font-size: 7px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }
            span {
              display: block;
              white-space: pre-wrap;
              font-size: 9px;
              line-height: 1.2;
            }
            footer {
              margin-top: 6px;
              padding-top: 5px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 8px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <header>
            ${pdfLogoMarkup}
            <div>
              <p class="eyebrow">${pdfBrandName} · Roteiros de viagem</p>
              <h1>${showTitle}</h1>
              <div class="meta">${showDate} · ${showCity}</div>
            </div>
            <div class="summary">
              <strong>${routesToPrint.length} roteiro${routesToPrint.length === 1 ? "" : "s"}</strong>
              <span>Selecionado${routesToPrint.length === 1 ? "" : "s"} para PDF</span>
            </div>
          </header>

          ${routeSections}

          <footer>Documento gerado pelo TourFlow.</footer>
        </body>
      </html>
    `);

    pdfWindow.document.close();
    pdfWindow.focus();
    pdfWindow.print();
  }

  return (
    <section className="form-layout">
      <article className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <span className="eyebrow">Roteiro de viagem</span>
              <h3>Saída de {activeBaseCity}</h3>
            </div>
          </div>

          <p className="panel-description">
            Defina saída da base da banda, destino, horários, veículo, motorista, passageiros e observações do roteiro.
          </p>

          {shows.length ? (
            <div className="show-context-card">
              <label>
                Show vinculado
                <select
                  value={selectedShowId || selectedShow?.id || ""}
                  onChange={(event) => setSelectedShowId?.(event.target.value)}
                >
                  {shows.map((show) => (
                    <option key={show.id} value={show.id}>
                      {formatDisplayDate(show.showDate)} · {show.eventName} · {show.city || "Cidade a definir"}
                    </option>
                  ))}
                </select>
              </label>

              <div className="linked-show-summary">
                <strong>{selectedShow?.eventName || "Show não selecionado"}</strong>
                <span>
                  {selectedShow
                    ? `${formatDisplayDate(selectedShow.showDate)} · ${selectedShow.city || "Cidade a definir"}`
                    : "Cadastre um show para vincular estas informações."}
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-state compact-empty form-empty-warning">
              <strong>Nenhum show cadastrado.</strong>
              <p>Cadastre um show antes de preencher o roteiro.</p>
            </div>
          )}

          {savedMessage ? <div className="save-message">{savedMessage}</div> : null}

          <div className="route-presets">
            <button type="button" onClick={() => createPresetRoute("van-banda", "ida")}>
              Van Banda · Ida
            </button>
            <button type="button" onClick={() => createPresetRoute("van-banda", "volta")}>
              Van Banda · Volta
            </button>
            <button type="button" onClick={() => createPresetRoute("van-tecnica", "ida")}>
              Van Técnica · Ida
            </button>
            <button type="button" onClick={() => createPresetRoute("van-tecnica", "volta")}>
              Van Técnica · Volta
            </button>
          </div>

          <div className="form-grid">
            <label>
              Nome do roteiro
              <input
                value={formData.routeName}
                onChange={(event) => updateField("routeName", event.target.value)}
                placeholder="Ex: Van Banda ida, Van Técnica volta..."
              />
            </label>

            <label>
              Tipo de roteiro
              <select
                value={formData.routeType}
                onChange={(event) => updateField("routeType", event.target.value)}
              >
                <option value="van-banda">Van Banda</option>
                <option value="van-tecnica">Van Técnica</option>
                <option value="carro-producao">Carro Produção</option>
                <option value="onibus">Ônibus</option>
                <option value="outro">Outro</option>
              </select>
            </label>

            <label>
              Sentido
              <select
                value={formData.direction}
                onChange={(event) => updateField("direction", event.target.value)}
              >
                <option value="ida">Ida</option>
                <option value="volta">Volta</option>
                <option value="ida-e-volta">Ida e volta</option>
              </select>
            </label>
            <label>
              Cidade destino
              <input
                value={formData.destinationCity}
                onChange={(event) => updateField("destinationCity", event.target.value)}
                placeholder="Cidade do show"
              />
            </label>

            <label>
              Local do show
              <input
                value={formData.showLocation}
                onChange={(event) => updateField("showLocation", event.target.value)}
                placeholder="Local de destino"
              />
            </label>

            <label>
              Data de saída
              <input
                type="date"
                value={formData.departureDate}
                onChange={(event) => updateField("departureDate", event.target.value)}
              />
            </label>

            <label>
              Horário de saída
              <input
                type="time"
                value={formData.departureTime}
                onChange={(event) => updateField("departureTime", event.target.value)}
              />
            </label>

            <label>
              Previsão de chegada
              <input
                type="time"
                value={formData.estimatedArrival}
                onChange={(event) => updateField("estimatedArrival", event.target.value)}
              />
            </label>

            

            <label>
              Veículo
              <input
                value={formData.vehicle}
                onChange={(event) => updateField("vehicle", event.target.value)}
                placeholder="Van, ônibus, carro..."
              />
            </label>

            <label>
              Motorista
              <input
                value={formData.driver}
                onChange={(event) => updateField("driver", event.target.value)}
                placeholder="Nome e telefone"
              />
            </label>

            <label>
              Placa
              <input
                value={formData.plate}
                onChange={(event) => updateField("plate", event.target.value)}
                placeholder="Placa do veículo"
              />
            </label>

            <label className="full-field">
              Lista de passageiros
              <textarea
                value={formData.passengers}
                onChange={(event) => updateField("passengers", event.target.value)}
                placeholder="Nome dos passageiros, equipe e banda"
              />
            </label>

            <label className="full-field">
              Paradas previstas
              <textarea
                value={formData.stops}
                onChange={(event) => updateField("stops", event.target.value)}
                placeholder="Paradas, abastecimento, alimentação, pontos de apoio"
              />
            </label>

            <label className="full-field">
              Observações
              <textarea
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Informações importantes do roteiro"
              />
            </label>
          </div>

          <div className="actions">
            <button type="submit" disabled={!selectedShow?.id}>
              {editingRouteId ? "Atualizar roteiro" : "Salvar roteiro"}
            </button>
            <button type="button" onClick={startNewRoute}>Novo roteiro</button>
            <button type="button" onClick={handleGenerateRoutePdf}>Gerar PDF do roteiro</button>
          </div>
        </form>
      </article>

      <article className="panel side-panel">
        <span className="eyebrow">Roteiros do show</span>
        <h3>{selectedShow?.eventName || "Sem show selecionado"}</h3>

        <div className="route-list">
          {routes.length ? (
            routes.map((route) => (
              <div
                key={route.id}
                className={route.id === editingRouteId ? "route-list-item active" : "route-list-item"}
              >
                <label className="pdf-route-check">
                  <input
                    type="checkbox"
                    checked={selectedPdfRouteIds.includes(route.id)}
                    onChange={() => togglePdfRoute(route.id)}
                  />
                  PDF
                </label>
                <button type="button" onClick={() => editRoute(route)}>
                  <strong>{route.routeName || `${routeTypeLabels[route.routeType] || "Roteiro"} · ${directionLabels[route.direction] || "Ida"}`}</strong>
                  <span>{formatDisplayDate(route.departureDate)} · {route.departureTime || "Horário a definir"}</span>
                </button>
                <button type="button" className="danger-action" onClick={() => deleteRoute(route.id)}>
                  Excluir
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state compact-empty">
              <strong>Nenhum roteiro salvo.</strong>
              <p>Adicione roteiros separados para van banda, van técnica, ida e volta.</p>
            </div>
          )}
        </div>

        <div className="mini-list route-summary-list">
          <div className="mini-list-item">
            <strong>Roteiro em edição</strong>
            <span>{formData.routeName || "Novo roteiro"}</span>
          </div>
          <div className="mini-list-item">
            <strong>Tipo / Sentido</strong>
            <span>{routeTypeLabels[formData.routeType] || "Van Banda"} · {directionLabels[formData.direction] || "Ida"}</span>
          </div>
          <div className="mini-list-item">
            <strong>Saída</strong>
            <span>
              {formatDisplayDate(formData.departureDate)} · {formData.departureTime || "Horário a definir"}
            </span>
          </div>
          <div className="mini-list-item">
            <strong>Transporte</strong>
            <span>{formData.vehicle || "A definir"}</span>
          </div>
        </div>
      </article>
    </section>
  );
}

function HospitalityFormView({
  shows,
  selectedShow,
  selectedShowId,
  setSelectedShowId,
  hospitalityData,
  onSaveHospitality,
  settingsData,
}) {
  const [formData, setFormData] = useState(hospitalityData || emptyHospitalityForm);
  const [savedMessage, setSavedMessage] = useState("");
  const activeArtistName = settingsData?.artistName || "TourFlow";
  const activeMainColor = settingsData?.mainColor || "#f59e0b";
  const activeSecondaryColor = settingsData?.secondaryColor || "#22c55e";
  const activeLogoUrl = normalizeImageUrl(settingsData?.logoUrl);

  useEffect(() => {
    setFormData(hospitalityData || emptyHospitalityForm);
    setSavedMessage("");
  }, [hospitalityData, selectedShow?.id]);

  function updateField(field, value) {
    setFormData((currentFormData) => ({ ...currentFormData, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedShow?.id) return;

    onSaveHospitality(selectedShow.id, formData);
    setSavedMessage("Informações de hospitalidade salvas para este show.");
  }

  function handleGenerateHospitalityPdf() {
    const showTitle = selectedShow?.eventName || "Show não selecionado";
    const showDate = formatDisplayDate(selectedShow?.showDate);
    const showCity = selectedShow?.city || "Cidade a definir";
    const showVenue = selectedShow?.venueName || "Local a definir";
    const pdfBrandName = activeArtistName;
    const pdfMainColor = activeMainColor;
    const pdfSecondaryColor = activeSecondaryColor;
    const pdfLogoUrl = activeLogoUrl;
    const pdfLogoMarkup = pdfLogoUrl ? `<img class="pdf-logo" src="${pdfLogoUrl}" alt="${pdfBrandName}" />` : `<div class="pdf-logo-fallback">TF</div>`;
    const hotelCard =
      formData.printHotel !== false
        ? `
            <div class="card highlight"><strong>Hotel</strong><span>${formData.hotelName || "A definir"}</span></div>
            <div class="card"><strong>Contato do hotel</strong><span>${formData.hotelContact || "A definir"}</span></div>
            <div class="card full"><strong>Endereço do hotel</strong><span>${formData.hotelAddress || "A definir"}</span></div>
          `
        : "";
    const roomListCard = formData.roomList
      ? `<div class="card full"><strong>Room list</strong><span>${formData.roomList}</span></div>`
      : "";
    const foodCard =
      formData.printFood !== false
        ? `<div class="card highlight"><strong>Diária de alimentação</strong><span>${formData.foodAllowance || "A definir"}</span></div>`
        : "";

    const pdfWindow = window.open("", "_blank", "width=900,height=1100");

    if (!pdfWindow) return;

    pdfWindow.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Hospitalidade · ${showTitle}</title>
          <style>
            * { box-sizing: border-box; }
            @page { size: A4; margin: 10mm; }
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #111827;
              background: #ffffff;
              font-size: 10px;
            }
            header {
              display: grid;
              grid-template-columns: 58px minmax(0, 1fr) auto;
              align-items: flex-start;
              gap: 14px;
              padding-bottom: 10px;
              border-bottom: 3px solid ${pdfMainColor};
              margin-bottom: 10px;
            }
            .pdf-logo,
            .pdf-logo-fallback {
              width: 50px;
              height: 50px;
              border-radius: 11px;
              object-fit: cover;
              display: block;
              border: 1px solid ${pdfMainColor};
              background: linear-gradient(135deg, ${pdfMainColor}, ${pdfSecondaryColor});
            }
            .pdf-logo-fallback {
              display: grid;
              place-items: center;
              color: #111827;
              font-size: 13px;
              font-weight: 900;
              letter-spacing: -0.08em;
            }
            .eyebrow {
              margin: 0 0 4px;
              color: ${pdfMainColor};
              font-size: 8px;
              font-weight: 800;
              letter-spacing: 0.14em;
              text-transform: uppercase;
            }
            h1 {
              display: inline-block;
              margin: 0;
              padding: 6px 10px;
              border-radius: 10px;
              color: #111827;
              background: ${pdfMainColor}14;
              border: 1px solid ${pdfMainColor};
              font-size: 30px;
              line-height: 1.05;
            }
            .meta {
              display: inline-block;
              margin-top: 7px;
              padding: 6px 10px;
              border-radius: 999px;
              color: #111827;
              background: ${pdfSecondaryColor}22;
              border: 1px solid ${pdfMainColor};
              font-size: 14px;
              font-weight: 900;
            }
            .status-box {
              display: grid;
              gap: 4px;
              text-align: right;
              font-size: 9px;
              color: #374151;
            }
            .section-title {
              margin: 10px 0 6px;
              padding: 6px 8px;
              border-radius: 7px;
              background: linear-gradient(135deg, ${pdfMainColor}, ${pdfSecondaryColor});
              color: #111827;
              font-size: 12px;
              line-height: 1.1;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 5px;
            }
            .card {
              padding: 6px 7px;
              border: 1px solid #d1d5db;
              border-radius: 7px;
              background: #f9fafb;
              min-height: 42px;
            }
            .full { grid-column: 1 / -1; }
            .highlight {
              border-color: ${pdfMainColor};
              background: ${pdfMainColor}14;
            }
            strong {
              display: block;
              margin-bottom: 3px;
              color: #374151;
              font-size: 8px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }
            span {
              display: block;
              white-space: pre-wrap;
              font-size: 10px;
              line-height: 1.25;
            }
            .highlight span {
              color: #111827;
              font-size: 11px;
              font-weight: 800;
            }
            footer {
              margin-top: 10px;
              padding-top: 6px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 8px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <header>
            ${pdfLogoMarkup}
            <div>
              <p class="eyebrow">${pdfBrandName} · Hospitalidade</p>
              <h1>${showTitle}</h1>
              <div class="meta">${showDate} · ${showCity} · ${showVenue}</div>
            </div>
            <div class="status-box">
              <strong>Resumo</strong>
              <span>Quartos: ${formData.roomCount || "A definir"}</span>
            </div>
          </header>

          <h2 class="section-title">Hotel e hospedagem</h2>
          <section class="grid">
            ${hotelCard}
            <div class="card"><strong>Check-in</strong><span>${formData.checkIn || "A definir"}</span></div>
            <div class="card"><strong>Check-out</strong><span>${formData.checkOut || "A definir"}</span></div>
            <div class="card"><strong>Quantidade de quartos</strong><span>${formData.roomCount || "A definir"}</span></div>
            ${roomListCard}
          </section>

          <h2 class="section-title">Alimentação</h2>
          <section class="grid">
            ${foodCard}
          </section>

          <footer>Documento gerado pelo TourFlow.</footer>
        </body>
      </html>
    `);

    pdfWindow.document.close();
    pdfWindow.focus();
    pdfWindow.print();
  }

  return (
    <section className="form-layout">
      <article className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <span className="eyebrow">Hospitalidade</span>
              <h3>Hotel e alimentação</h3>
            </div>
          </div>
          <p className="panel-description">
            Controle hotel, check-in, check-out, quartos e alimentação.
          </p>

          {shows.length ? (
            <div className="show-context-card">
              <label>
                Show vinculado
                <select
                  value={selectedShowId || selectedShow?.id || ""}
                  onChange={(event) => setSelectedShowId?.(event.target.value)}
                >
                  {shows.map((show) => (
                    <option key={show.id} value={show.id}>
                      {formatDisplayDate(show.showDate)} · {show.eventName} · {show.city || "Cidade a definir"}
                    </option>
                  ))}
                </select>
              </label>

              <div className="linked-show-summary">
                <strong>{selectedShow?.eventName || "Show não selecionado"}</strong>
                <span>
                  {selectedShow
                    ? `${formatDisplayDate(selectedShow.showDate)} · ${selectedShow.city || "Cidade a definir"}`
                    : "Cadastre um show para vincular estas informações."}
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-state compact-empty form-empty-warning">
              <strong>Nenhum show cadastrado.</strong>
              <p>Cadastre um show antes de preencher a hospitalidade.</p>
            </div>
          )}

          {savedMessage ? <div className="save-message">{savedMessage}</div> : null}

          <div className="form-grid">
            <label>
              Hotel
              <input
                value={formData.hotelName}
                onChange={(event) => updateField("hotelName", event.target.value)}
                placeholder="Nome do hotel"
              />
              <span className="inline-check">
                <input
                  type="checkbox"
                  checked={formData.printHotel !== false}
                  onChange={(event) => updateField("printHotel", event.target.checked)}
                />
                Imprimir no PDF
              </span>
            </label>
            <label>
              Contato do hotel
              <input
                value={formData.hotelContact}
                onChange={(event) => updateField("hotelContact", event.target.value)}
                placeholder="Nome e telefone"
              />
            </label>
            <label>
              Endereço do hotel
              <input
                value={formData.hotelAddress}
                onChange={(event) => updateField("hotelAddress", event.target.value)}
                placeholder="Endereço completo"
              />
            </label>
            <label>
              Check-in
              <input
                type="datetime-local"
                value={formData.checkIn}
                onChange={(event) => updateField("checkIn", event.target.value)}
              />
            </label>
            <label>
              Check-out
              <input
                type="datetime-local"
                value={formData.checkOut}
                onChange={(event) => updateField("checkOut", event.target.value)}
              />
            </label>
            <label>
              Quantidade de quartos
              <input
                value={formData.roomCount}
                onChange={(event) => updateField("roomCount", event.target.value)}
                placeholder="Ex: 5 quartos"
              />
            </label>
            <label className="full-field">
              Room list
              <textarea
                value={formData.roomList}
                onChange={(event) => updateField("roomList", event.target.value)}
                placeholder="Distribuição dos quartos e nomes dos hóspedes"
              />
            </label>
            <label>
              Diária de alimentação
              <input
                value={formData.foodAllowance}
                onChange={(event) => updateField("foodAllowance", event.target.value)}
                placeholder="Valor, forma de pagamento ou responsável"
              />
              <span className="inline-check">
                <input
                  type="checkbox"
                  checked={formData.printFood !== false}
                  onChange={(event) => updateField("printFood", event.target.checked)}
                />
                Imprimir no PDF
              </span>
            </label>
          </div>

          <div className="actions">
            <button type="submit" disabled={!selectedShow?.id}>Salvar hospitalidade</button>
            <button type="button" onClick={handleGenerateHospitalityPdf}>Gerar PDF hospitalidade</button>
          </div>
        </form>
      </article>

      <article className="panel side-panel">
        <span className="eyebrow">Resumo de hospitalidade</span>
        <h3>{selectedShow?.eventName || "Sem show selecionado"}</h3>
        <div className="mini-list">
          <div className="mini-list-item">
            <strong>Hotel</strong>
            <span>{formData.printHotel !== false ? formData.hotelName || "A definir" : "Hotel oculto no PDF"}</span>
          </div>
          <div className="mini-list-item">
            <strong>Check-in / Check-out</strong>
            <span>{formData.checkIn || "Check-in a definir"} · {formData.checkOut || "Check-out a definir"}</span>
          </div>
          <div className="mini-list-item">
            <strong>Alimentação</strong>
            <span>{formData.printFood !== false ? formData.foodAllowance || "A definir" : "Alimentação oculta no PDF"}</span>
          </div>
        </div>
      </article>
    </section>
  );
}

function SimpleFormView({
  eyebrow,
  title,
  description,
  fields,
  shows = [],
  selectedShow,
  selectedShowId,
  setSelectedShowId,
}) {
  return (
    <section className="form-layout">
      <article className="panel form-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h3>{title}</h3>
          </div>
        </div>
        <p className="panel-description">{description}</p>

        {shows.length ? (
          <div className="show-context-card">
            <label>
              Show vinculado
              <select
                value={selectedShowId || selectedShow?.id || ""}
                onChange={(event) => setSelectedShowId?.(event.target.value)}
              >
                {shows.map((show) => (
                  <option key={show.id} value={show.id}>
                    {formatDisplayDate(show.showDate)} · {show.eventName} · {show.city || "Cidade a definir"}
                  </option>
                ))}
              </select>
            </label>

            <div className="linked-show-summary">
              <strong>{selectedShow?.eventName || "Show não selecionado"}</strong>
              <span>
                {selectedShow
                  ? `${formatDisplayDate(selectedShow.showDate)} · ${selectedShow.city || "Cidade a definir"}`
                  : "Cadastre um show para vincular estas informações."}
              </span>
            </div>
          </div>
        ) : (
          <div className="empty-state compact-empty form-empty-warning">
            <strong>Nenhum show cadastrado.</strong>
            <p>Cadastre um show antes de preencher esta área da produção.</p>
          </div>
        )}

        <div className="form-grid">
          {fields.map((field) => (
            <label
              key={field}
              className={field === "Observações" ? "full-field" : undefined}
            >
              {field}
              {field.includes("Observações") ||
              field.includes("Lista") ||
              field.includes("Room") ? (
                <textarea placeholder={field} />
              ) : (
                <input placeholder={field} />
              )}
            </label>
          ))}
        </div>

        <div className="actions">
          <button type="button">Salvar informações</button>
          <button type="button">Gerar PDF</button>
        </div>
      </article>
    </section>
  );
}

function ContactsView({ contacts = [], onSaveContact, onDeleteContact }) {
  const [formData, setFormData] = useState(emptyContactForm);
  const [editingContactId, setEditingContactId] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      const groupCompare = (a.group || "").localeCompare(b.group || "");
      if (groupCompare !== 0) return groupCompare;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [contacts]);

  function updateField(field, value) {
    setFormData((currentFormData) => ({ ...currentFormData, [field]: value }));
  }

  function resetForm() {
    setFormData(emptyContactForm);
    setEditingContactId("");
    setSavedMessage("");
  }

  function editContact(contact) {
    setFormData({ ...emptyContactForm, ...contact });
    setEditingContactId(contact.id);
    setSavedMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      setSavedMessage("Preencha o nome do contato.");
      return;
    }

    onSaveContact({
      ...formData,
      id: editingContactId || formData.id,
    });
    setSavedMessage(editingContactId ? "Contato atualizado." : "Contato salvo.");
    setFormData(emptyContactForm);
    setEditingContactId("");
  }

  return (
    <section className="form-layout">
      <article className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <span className="eyebrow">Contatos</span>
              <h3>{editingContactId ? "Editar contato" : "Novo contato"}</h3>
            </div>
          </div>
          <p className="panel-description">
            Cadastre contratantes, contratados, banda, equipe técnica e fornecedores em uma lista única da turnê.
          </p>

          {savedMessage ? <div className="save-message">{savedMessage}</div> : null}

          <div className="form-grid">
            <label>
              Grupo
              <select
                value={formData.group}
                onChange={(event) => updateField("group", event.target.value)}
              >
                {Object.entries(contactGroupLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label>
              Nome
              <input
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Nome completo"
              />
            </label>
            <label>
              Função / empresa
              <input
                value={formData.role}
                onChange={(event) => updateField("role", event.target.value)}
                placeholder="Função, empresa ou responsabilidade"
              />
            </label>
            <label>
              WhatsApp
              <input
                value={formData.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="(00) 00000-0000"
              />
            </label>
            <label>
              E-mail
              <input
                type="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="email@exemplo.com"
              />
            </label>
            <label className="full-field">
              Observações
              <textarea
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Informações importantes sobre este contato"
              />
            </label>
          </div>

          <div className="actions">
            <button type="submit">{editingContactId ? "Atualizar contato" : "Salvar contato"}</button>
            <button type="button" onClick={resetForm}>Novo contato</button>
          </div>
        </form>
      </article>

      <article className="panel side-panel">
        <span className="eyebrow">Lista de contatos</span>
        <h3>{contacts.length} contato{contacts.length === 1 ? "" : "s"}</h3>

        <div className="contact-list">
          {sortedContacts.length ? (
            sortedContacts.map((contact) => (
              <div key={contact.id} className="contact-list-item">
                <button type="button" onClick={() => editContact(contact)}>
                  <strong>{contact.name || "Sem nome"}</strong>
                  <span>{contactGroupLabels[contact.group] || "Contato"} · {contact.role || "Função a definir"}</span>
                  <small>{contact.phone || "WhatsApp a definir"}{contact.email ? ` · ${contact.email}` : ""}</small>
                </button>
                <button
                  type="button"
                  className="danger-action"
                  onClick={() => onDeleteContact(contact.id)}
                >
                  Excluir
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state compact-empty">
              <strong>Nenhum contato salvo.</strong>
              <p>Cadastre os contatos principais da turnê.</p>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

function ChecklistView({
  shows = [],
  selectedShow,
  selectedShowId,
  setSelectedShowId,
  checklistItems = [],
  onSaveChecklistItem,
}) {
  const savedChecklistById = useMemo(() => {
    return checklistItems.reduce((itemsMap, item) => {
      itemsMap[item.id] = item;
      return itemsMap;
    }, {});
  }, [checklistItems]);

  const checklistGroups = useMemo(() => {
    return defaultChecklistGroups.map((group) => ({
      ...group,
      items: group.items.map((task, index) => {
        const itemId = `${group.category}-${index}`;
        return {
          id: itemId,
          category: group.category,
          task,
          responsible: "",
          deadline: "",
          priority: "normal",
          done: false,
          ...(savedChecklistById[itemId] || {}),
        };
      }),
    }));
  }, [savedChecklistById]);

  const flatChecklistItems = checklistGroups.flatMap((group) => group.items);
  const doneCount = flatChecklistItems.filter((item) => item.done).length;
  const openCount = flatChecklistItems.length - doneCount;

  function toggleDefaultChecklistItem(item) {
    if (!selectedShow?.id) return;

    onSaveChecklistItem(selectedShow.id, {
      ...item,
      done: !item.done,
    });
  }

  return (
    <section className="form-layout">
      <article className="panel form-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Checklists</span>
            <h3>Checklist padrão do show</h3>
          </div>
        </div>
        <p className="panel-description">
          Use a lista padrão da produção e marque cada tarefa conforme for concluindo.
        </p>

        {shows.length ? (
          <div className="show-context-card">
            <label>
              Show vinculado
              <select
                value={selectedShowId || selectedShow?.id || ""}
                onChange={(event) => setSelectedShowId?.(event.target.value)}
              >
                {shows.map((show) => (
                  <option key={show.id} value={show.id}>
                    {formatDisplayDate(show.showDate)} · {show.eventName} · {show.city || "Cidade a definir"}
                  </option>
                ))}
              </select>
            </label>

            <div className="linked-show-summary">
              <strong>{selectedShow?.eventName || "Show não selecionado"}</strong>
              <span>
                {selectedShow
                  ? `${formatDisplayDate(selectedShow.showDate)} · ${selectedShow.city || "Cidade a definir"}`
                  : "Cadastre um show para vincular o checklist."}
              </span>
            </div>
          </div>
        ) : (
          <div className="empty-state compact-empty form-empty-warning">
            <strong>Nenhum show cadastrado.</strong>
            <p>Cadastre um show antes de usar o checklist.</p>
          </div>
        )}

        <div className="mini-list checklist-summary-list">
          <div className="mini-list-item">
            <strong>Pendentes</strong>
            <span>{openCount}</span>
          </div>
          <div className="mini-list-item">
            <strong>Concluídas</strong>
            <span>{doneCount}</span>
          </div>
        </div>
      </article>

      <article className="panel side-panel checklist-side-panel">
        <span className="eyebrow">Checklist do show</span>
        <h3>{selectedShow?.eventName || "Sem show selecionado"}</h3>

        <div className="checklist-category-grid static-checklist-grid">
          {checklistGroups.map((group) => (
            <article key={group.category} className="checklist-category-card">
              <span className="eyebrow">Checklist</span>
              <h4>{group.title}</h4>

              <div className="checklist-card-items static-checklist-items">
                {group.items.map((item) => (
                  <label
                    key={item.id}
                    className={item.done ? "static-checklist-task done" : "static-checklist-task"}
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      disabled={!selectedShow?.id}
                      onChange={() => toggleDefaultChecklistItem(item)}
                    />
                    <span>{item.task}</span>
                  </label>
                ))}
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

export default App;

function FinanceView({
  shows,
  selectedShow,
  selectedShowId,
  setSelectedShowId,
  financeData,
  onSaveFinance,
}) {
  const [formData, setFormData] = useState(financeData || emptyFinanceForm);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    setFormData(financeData || emptyFinanceForm);
    setSavedMessage("");
  }, [financeData, selectedShow?.id]);

  const totalRevenue = parseMoneyValue(formData.fee);
  const totalCosts =
    parseMoneyValue(formData.transportCost) +
    parseMoneyValue(formData.hotelCost) +
    parseMoneyValue(formData.foodCost) +
    parseMoneyValue(formData.technicalCost) +
    parseMoneyValue(formData.otherCost);
  const estimatedProfit = totalRevenue - totalCosts;

  function updateField(field, value) {
    setFormData((currentFormData) => ({ ...currentFormData, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedShow?.id) return;

    onSaveFinance(selectedShow.id, formData);
    setSavedMessage("Financeiro salvo para este show.");
  }

  return (
    <section className="form-layout">
      <article className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <div className="panel-header">
            <div>
              <span className="eyebrow">Financeiro</span>
              <h3>Resultado financeiro do show</h3>
            </div>
          </div>
          <p className="panel-description">
            Controle cachê previsto, custos principais e lucro estimado por show.
          </p>

          {shows.length ? (
            <div className="show-context-card">
              <label>
                Show vinculado
                <select
                  value={selectedShowId || selectedShow?.id || ""}
                  onChange={(event) => setSelectedShowId?.(event.target.value)}
                >
                  {shows.map((show) => (
                    <option key={show.id} value={show.id}>
                      {formatDisplayDate(show.showDate)} · {show.eventName} · {show.city || "Cidade a definir"}
                    </option>
                  ))}
                </select>
              </label>

              <div className="linked-show-summary">
                <strong>{selectedShow?.eventName || "Show não selecionado"}</strong>
                <span>
                  {selectedShow
                    ? `${formatDisplayDate(selectedShow.showDate)} · ${selectedShow.city || "Cidade a definir"}`
                    : "Cadastre um show para lançar o financeiro."}
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-state compact-empty form-empty-warning">
              <strong>Nenhum show cadastrado.</strong>
              <p>Cadastre um show antes de lançar valores.</p>
            </div>
          )}

          {savedMessage ? <div className="save-message">{savedMessage}</div> : null}

          <div className="form-grid">
            <label>
              Cachê / receita prevista
              <input
                value={formData.fee}
                onChange={(event) => updateField("fee", event.target.value)}
                placeholder="Ex: 15000"
              />
            </label>
            <label>
              Transporte
              <input
                value={formData.transportCost}
                onChange={(event) => updateField("transportCost", event.target.value)}
                placeholder="Ex: 2500"
              />
            </label>
            <label>
              Hotel
              <input
                value={formData.hotelCost}
                onChange={(event) => updateField("hotelCost", event.target.value)}
                placeholder="Ex: 1800"
              />
            </label>
            <label>
              Alimentação
              <input
                value={formData.foodCost}
                onChange={(event) => updateField("foodCost", event.target.value)}
                placeholder="Ex: 900"
              />
            </label>
            <label>
              Técnica
              <input
                value={formData.technicalCost}
                onChange={(event) => updateField("technicalCost", event.target.value)}
                placeholder="Ex: 1200"
              />
            </label>
            <label>
              Outros custos
              <input
                value={formData.otherCost}
                onChange={(event) => updateField("otherCost", event.target.value)}
                placeholder="Ex: 500"
              />
            </label>
            <label className="full-field">
              Observações financeiras
              <textarea
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Repasses, pendências, formas de pagamento ou acordos específicos."
              />
            </label>
          </div>

          <div className="actions">
            <button type="submit" disabled={!selectedShow?.id}>Salvar financeiro</button>
          </div>
        </form>
      </article>

      <article className="panel side-panel finance-side-panel">
        <span className="eyebrow">Resultado</span>
        <h3>{selectedShow?.eventName || "Sem show selecionado"}</h3>

        <div className="finance-result-card">
          <span>Lucro estimado</span>
          <strong className={estimatedProfit < 0 ? "negative-money" : "positive-money"}>
            {formatMoneyValue(estimatedProfit)}
          </strong>
        </div>

        <div className="mini-list finance-summary-list">
          <div className="mini-list-item">
            <strong>Receita prevista</strong>
            <span>{formatMoneyValue(totalRevenue)}</span>
          </div>
          <div className="mini-list-item">
            <strong>Custos totais</strong>
            <span>{formatMoneyValue(totalCosts)}</span>
          </div>
          <div className="mini-list-item">
            <strong>Transporte</strong>
            <span>{formatMoneyValue(parseMoneyValue(formData.transportCost))}</span>
          </div>
          <div className="mini-list-item">
            <strong>Hotel</strong>
            <span>{formatMoneyValue(parseMoneyValue(formData.hotelCost))}</span>
          </div>
          <div className="mini-list-item">
            <strong>Alimentação</strong>
            <span>{formatMoneyValue(parseMoneyValue(formData.foodCost))}</span>
          </div>
          <div className="mini-list-item">
            <strong>Técnica</strong>
            <span>{formatMoneyValue(parseMoneyValue(formData.technicalCost))}</span>
          </div>
          <div className="mini-list-item">
            <strong>Outros</strong>
            <span>{formatMoneyValue(parseMoneyValue(formData.otherCost))}</span>
          </div>
        </div>
      </article>
    </section>
  );
}