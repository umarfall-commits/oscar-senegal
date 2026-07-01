"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BookOpen,
  Download,
  Users,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  Eye,
  Target,
  TrendingUp,
  GraduationCap,
  Briefcase,
  CreditCard,
  Vote,
  Shield,
  Zap,
  Heart,
  Globe,
  AlertTriangle,
  ThumbsUp,
  Send,
  Menu,
  X,
  FileText,
  BarChart3,
  Building2,
  QrCode,
  CheckCircle2,
  Scale,
  Database,
  Layers,
  Fingerprint,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";


/* ─── Types ─── */
interface Stats {
  citizenCount: number;
  ambassadorCount: number;
  downloadCount: number;
  contributionCount: number;
}
interface ForumPost {
  id: string;
  author: string;
  region: string | null;
  theme: string;
  content: string;
  upvotes: number;
  createdAt: string;
}

/* ─── Constants ─── */
const REGIONS = [
  "Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Diourbel",
  "Fatick", "Kaffrine", "Kaolack", "Kédougou", "Kolda",
  "Louga", "Matam", "Sédhiou", "Tambacounda",
];
const NAV_ITEMS = [
  { label: "Manifeste", href: "#manifeste" },
  { label: "Fonctionnement", href: "#fonctionnement" },
  { label: "Télécharger", href: "#telecharger" },
  { label: "Cas d'usage", href: "#cas-usage" },
  { label: "Débats", href: "#debats" },
  { label: "Forum", href: "#forum" },
  { label: "Feuille de route", href: "#roadmap" },
  { label: "S'engager", href: "#engager" },
  { label: "Transparence", href: "#transparence" },
];
const THEMES_FORUM = [
  "Défi Jeunesse", "Gouvernance", "Éducation", "Économie",
  "Santé", "Souveraineté numérique", "Décentralisation", "Autre",
];

/* ─── Animated Counter ─── */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / 1500, 1);
            setDisplay(Math.floor((1 - Math.pow(1 - progress, 3)) * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return <span ref={ref}>{display.toLocaleString("fr-FR")}{suffix}</span>;
}

/* ─── Section Wrapper ─── */
function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-16 md:py-20 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">{children}</div>
    </section>
  );
}

function SectionTitle({ children, color = "green" }: { children: React.ReactNode; color?: "green" | "gold" | "red" }) {
  const colors = { green: "border-senegal-green", gold: "border-senegal-gold", red: "border-senegal-red" };
  return <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${color === "green" ? "" : ""}`}><span className={`border-l-4 ${colors[color]} pl-4`}>{children}</span></h2>;
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── MAIN PAGE ─── */
/* ═══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({ citizenCount: 1247, ambassadorCount: 156, downloadCount: 3892, contributionCount: 87 });
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [activeSection, setActiveSection] = useState("manifeste");

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRegion, setFormRegion] = useState("");
  const [formComment, setFormComment] = useState("");
  const [formAmbassador, setFormAmbassador] = useState(false);
  const [formNewsletter, setFormNewsletter] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [forumAuthor, setForumAuthor] = useState("");
  const [forumRegion, setForumRegion] = useState("");
  const [forumTheme, setForumTheme] = useState("");
  const [forumContent, setForumContent] = useState("");
  const [forumSubmitting, setForumSubmitting] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {});
    fetch("/api/forum").then((r) => r.json()).then(setForumPosts).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      for (const item of NAV_ITEMS) {
        const el = document.querySelector(item.href);
        if (el && el instanceof HTMLElement && el.offsetTop <= scrollY) setActiveSection(item.href.slice(1));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const trackDownload = useCallback((fileType: string, fileName: string) => {
    fetch("/api/downloads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileType, fileName }) }).catch(() => {});
    setStats((s) => ({ ...s, downloadCount: s.downloadCount + 1 }));
  }, []);

  const handleEngagement = async () => {
    if (!formName.trim() || !formEmail.trim() || !formRegion) {
      toast({ title: "Champs obligatoires", description: "Nom, email et région sont requis.", variant: "destructive" });
      return;
    }
    setFormSubmitting(true);
    try {
      const res = await fetch("/api/engagements", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname: formName, email: formEmail, phone: formPhone, region: formRegion, comment: formComment, ambassador: formAmbassador, newsletter: formNewsletter }),
      });
      if (res.ok) {
        toast({ title: "Merci pour votre engagement !", description: "Vous êtes compté parmi les bâtisseurs du Sénégal 2035." });
        setFormName(""); setFormEmail(""); setFormPhone(""); setFormRegion(""); setFormComment(""); setFormAmbassador(false); setFormNewsletter(true);
        setStats((s) => ({ ...s, citizenCount: s.citizenCount + 1, ambassadorCount: s.ambassadorCount + (formAmbassador ? 1 : 0) }));
      } else {
        const data = await res.json();
        toast({ title: "Erreur", description: data.error || "Veuillez réessayer.", variant: "destructive" });
      }
    } catch { toast({ title: "Erreur réseau", variant: "destructive" }); }
    setFormSubmitting(false);
  };

  const handleForumSubmit = async () => {
    if (!forumAuthor.trim() || !forumTheme || !forumContent.trim()) {
      toast({ title: "Champs obligatoires", description: "Auteur, thème et contenu requis.", variant: "destructive" });
      return;
    }
    if (forumContent.trim().length < 20) {
      toast({ title: "Contenu trop court", description: "Minimum 20 caractères.", variant: "destructive" });
      return;
    }
    setForumSubmitting(true);
    try {
      const res = await fetch("/api/forum", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: forumAuthor, region: forumRegion || null, theme: forumTheme, content: forumContent }),
      });
      if (res.ok) {
        const p = await res.json();
        setForumPosts((prev) => [p, ...prev]);
        toast({ title: "Contribution publiée !", description: "Votre voix compte pour le Sénégal." });
        setForumAuthor(""); setForumRegion(""); setForumTheme(""); setForumContent("");
        setStats((s) => ({ ...s, contributionCount: s.contributionCount + 1 }));
      } else {
        const data = await res.json();
        toast({ title: "Erreur", description: data.error, variant: "destructive" });
      }
    } catch { toast({ title: "Erreur réseau", variant: "destructive" }); }
    setForumSubmitting(false);
  };

  const faqs = [
    { q: "Pourquoi OSCAR pourrait-il échouer ?", a: "Tout changement de paradigme rencontre de la résistance. Les principales menaces sont la résistance politique des élites actuelles, le risque de centralisation numérique si les garde-fous démocratiques ne sont pas assez robustes, et la fatigue citoyenne face aux promesses non tenues. C'est précisément pour ces raisons que le modèle OSCAR intègre un Contrat Citoyen avec référendum révocatoire — un mécanisme concret de contrôle que le citoyen peut déclencher." },
    { q: "Quel est le risque de centralisation du RNUI ?", a: "Le Registre Numérique Unique d'Identité (RNUI) concentre beaucoup de données. Le risque de surveillance ou d'abus existe si les mécanismes de contrôle indépendant, d'audit externe et de protection des données ne sont pas suffisamment renforcés. Le Livre Blanc propose une architecture de souveraineté numérique, mais la mise en œuvre devra inclure un cadre juridique strict de protection de la vie privée." },
    { q: "Comment financer cette transformation ?", a: "Le Livre Blanc ne détaille pas encore un budget précis. Les sources potentielles incluent la réallocation budgétaire (réduction de la bureaucratie redondante), les partenariats internationaux stratégiques, et la mobilisation de la diaspora sénégalaise. Un budget détaillé est en préparation en annexe." },
    { q: "Comment engager les citoyens fatigués par les promesses ?", a: "La stratégie repose sur des résultats concrets et mesurables dès les premières phases : réduction visible des délais administratifs, transparence budgétaire en temps réel, et participation directe via le Contrat Citoyen. Il ne s'agit pas de promesses abstraites mais de changements tangibles dans le quotidien des Sénégalais." },
  ];

  const roadmapPhases = [
    { phase: "Phase 1 — Fondations (2026–2028)", color: "bg-senegal-green", items: ["Adoption du Contrat Citoyen par référendum", "Création des Super-Ministères pilotes", "Lancement du RNUI dans 3 régions test", "Mise en place des indicateurs de performance", "Formation initiale des cadres de l'État"] },
    { phase: "Phase 2 — Déploiement (2029–2032)", color: "bg-senegal-gold", items: ["Extension du RNUI à l'échelle nationale", "Généralisation des Contrats de Performance", "Plateforme de transparence budgétaire temps réel", "Programme national d'engagement citoyen", "Audit indépendant et ajustements structurels"] },
    { phase: "Phase 3 — Consolidation (2033–2035)", color: "bg-senegal-red", items: ["Évaluation globale via le Tableau de Bord de la Nation", "Premier référendum révocatoire citoyen", "Modèle OSCAR pleinement opérationnel", "Rayonnement régional et partage du modèle africain", "Sénégal classé parmi les 3 meilleures gouvernances d'Afrique"] },
  ];

  const useCases = [
    { icon: <GraduationCap className="h-7 w-7" />, title: "Inscription scolaire en 5 minutes", before: "3 semaines de démarches, 5 bureaux différents, documents perdus.", after: "Via le RNUI : vérification automatique de l'identité, affectation en temps réel, confirmation SMS.", tag: "Éducation" },
    { icon: <Briefcase className="h-7 w-7" />, title: "Création d'entreprise sans intermédiaire", before: "Passe par des intermédiaires, coûts cachés, corruption systémique.", after: "Guichet unique numérique : enregistrement, NINEA, compte bancaire en 48h.", tag: "Économie" },
    { icon: <CreditCard className="h-7 w-7" />, title: "Accès au microcrédit jeunesse", before: "Procédures opaques, garanties que les jeunes ne peuvent pas fournir.", after: "Évaluation via le RNUI : historique, mérite, projet validé. Réponse en 72h.", tag: "Jeunesse" },
    { icon: <Vote className="h-7 w-7" />, title: "Suivi budgétaire en temps réel", before: "Le citoyen ne sait jamais où va l'argent public.", after: "Dashboard public : chaque franc CFA alloué et dépensé est traçable.", tag: "Transparence" },
    { icon: <Shield className="h-7 w-7" />, title: "Permis de conduire sans corruption", before: "Fraude aux examens, faux permis, files d'attente interminables.", after: "Examen numérique standardisé, résultat transparent, délivrance automatique.", tag: "Justice" },
    { icon: <Heart className="h-7 w-7" />, title: "Participation citoyenne directe", before: "Le citoyen vote tous les 5 ans et disparaît du radar.", after: "Contrat Citoyen actif : pétitions, évaluations, référendum révocatoire.", tag: "Citoyenneté" },
  ];

  const mechanismes = [
    { icon: <Fingerprint className="h-8 w-8 text-senegal-green" />, title: "RNUI — Registre Numérique Unique", desc: "Une identité numérique souveraine pour chaque citoyen. Un seul point d'accès à tous les services publics : état civil, éducation, santé, fiscalité. Hébergé sur le territoire national, sous contrôle citoyen." },
    { icon: <Scale className="h-8 w-8 text-senegal-gold" />, title: "Contrat Citoyen & Référendum Révocatoire", desc: "Un contrat entre le chef de l'État et le peuple avec 5 engagements chiffrés. Si les résultats ne sont pas au rendez-vous à mi-mandat, 500 000 signatures peuvent déclencher un référendum révocatoire." },
    { icon: <Database className="h-8 w-8 text-senegal-red" />, title: "TBN — Tableau de Bord de la Nation", desc: "Une plateforme publique en temps réel qui affiche l'exécution budgétaire, les indicateurs de performance de chaque ministère et la satisfaction citoyenne. Transparence totale, zéro opacité." },
    { icon: <Layers className="h-8 w-8 text-senegal-green" />, title: "Super-Ministères & État-Écosystème", desc: "Finie la fragmentation en 30 ministères cloisonnés. Des super-ministères thématiques fonctionnent en mode projet, avec des contrats de performance annuels et des évaluations indépendantes." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ═══ FLAG STRIP ═══ */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-gradient-to-r from-senegal-green via-senegal-gold to-senegal-red" />

      {/* ═══ NAVIGATION ═══ */}
      <nav className="sticky top-1.5 z-40 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <a href="#manifeste" className="flex items-center gap-0.5 font-black text-2xl tracking-tight">
              <span className="text-senegal-green">O</span><span className="text-senegal-gold">S</span><span className="text-senegal-red">C</span><span className="text-senegal-green">A</span><span className="text-senegal-gold">R</span>
            </a>
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href} className={`px-3 py-1.5 text-sm rounded-full transition-colors ${activeSection === item.href.slice(1) ? "bg-senegal-green text-white font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>{item.label}</a>
              ))}
            </div>
            <div className="hidden lg:block">
              <a href="#engager"><Button size="sm" className="bg-senegal-green hover:bg-senegal-green/90 text-white rounded-full">S&apos;engager</Button></a>
            </div>
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-border bg-white">
              <div className="px-4 py-3 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg text-sm ${activeSection === item.href.slice(1) ? "bg-senegal-green/10 text-senegal-green font-medium" : "text-muted-foreground"}`}>{item.label}</a>
                ))}
                <a href="#engager" onClick={() => setMobileMenuOpen(false)}><Button className="w-full mt-2 bg-senegal-green hover:bg-senegal-green/90 text-white rounded-full">S&apos;engager</Button></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section id="manifeste" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-senegal-green/5 via-transparent to-senegal-gold/5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-senegal-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-senegal-green/5 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
          <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Badge variant="outline" className="mb-6 border-senegal-green/30 text-senegal-green text-xs">Livre Blanc — Diffusion libre et gratuite — 2026</Badge>

            {/* ── BIG OSCAR TITLE ── */}
            <div className="mb-6">
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-4">
                <span className="inline-block text-senegal-green drop-shadow-sm">O</span><span className="inline-block text-senegal-gold drop-shadow-sm">S</span><span className="inline-block text-senegal-red drop-shadow-sm">C</span><span className="inline-block text-senegal-green drop-shadow-sm">A</span><span className="inline-block text-senegal-gold drop-shadow-sm">R</span>
              </h1>
              <p className="text-2xl md:text-4xl font-black text-senegal-dark tracking-tight mb-4" style={{letterSpacing: "-0.02em"}}>Le changement commence par la connaissance</p>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm md:text-base font-medium text-foreground/70">
                <span>Orienté Résultats</span><span className="text-senegal-gold">·</span>
                <span>Souverain &amp; Solidaire</span><span className="text-senegal-red">·</span>
                <span>Compétent</span><span className="text-senegal-gold">·</span>
                <span>Agile</span><span className="text-senegal-red">·</span>
                <span>Responsable</span>
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-6">
              Un nouveau modèle pour le <span className="text-senegal-green">Sénégal</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-4 max-w-2xl leading-relaxed">
              Notre pays traverse une crise silencieuse : dualité au sommet de l&apos;État, absence de débat sur l&apos;avenir, jeunesse sacrifiée par tous les régimes, confiance brisée. Le modèle classique de gouvernance est <strong className="text-foreground">épuisé</strong>.
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              <strong className="text-foreground">OSCAR</strong> propose une alternative concrète, pragmatique et africaine : un État orienté résultats, où la compétence prime sur la connivence, où la transparence est la règle, et où le citoyen redevient acteur.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#telecharger"><Button size="lg" className="bg-senegal-green hover:bg-senegal-green/90 text-white rounded-full gap-2"><Download className="h-4 w-4" /> Télécharger le Livre Blanc</Button></a>
              <a href="#forum"><Button size="lg" variant="outline" className="rounded-full gap-2 border-senegal-gold text-senegal-dark hover:bg-senegal-gold/10"><MessageSquare className="h-4 w-4" /> Contribuer au débat</Button></a>
            </div>
          </motion.div>
          <motion.div className="lg:col-span-2 hidden lg:block" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
            <img src="/senegal-map.png" alt="Carte du Sénégal — OSCAR connecte les 14 régions" className="w-full h-auto max-h-[520px] rounded-2xl drop-shadow-2xl" />
          </motion.div>
          </div>
          <motion.div className="mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <a href="#fonctionnement" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-senegal-green transition-colors">
              Découvrir comment ça fonctionne <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="bg-senegal-dark text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: stats.citizenCount, label: "Citoyens engagés", icon: <Users className="h-5 w-5 mx-auto mb-2" /> },
              { value: stats.downloadCount, label: "Téléchargements", icon: <Download className="h-5 w-5 mx-auto mb-2" /> },
              { value: stats.ambassadorCount, label: "Ambassadeurs", icon: <Globe className="h-5 w-5 mx-auto mb-2" /> },
              { value: stats.contributionCount, label: "Contributions forum", icon: <MessageSquare className="h-5 w-5 mx-auto mb-2" /> },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-senegal-gold">{s.icon}</div>
                <div className="text-3xl md:text-4xl font-bold"><AnimatedNumber value={s.value} /></div>
                <div className="text-xs md:text-sm opacity-70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMMENT OSCAR FONCTIONNE ═══ */}
      <Section id="fonctionnement">
        <SectionTitle color="gold">Comment OSCAR fonctionne</SectionTitle>
        <p className="text-muted-foreground mb-8 pl-6 max-w-2xl">Quatre mécanismes concrets transforment la gouvernance. Pas de théorie abstraite — des outils opérationnels mesurables.</p>
        <div className="grid md:grid-cols-2 gap-5">
          {mechanismes.map((m, i) => (
            <motion.div key={m.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-transparent hover:border-l-senegal-green">
                <CardContent className="p-6">
                  <div className="mb-3">{m.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{m.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Separator className="max-w-6xl mx-auto" />

      {/* ═══ DOWNLOAD ═══ */}
      <Section id="telecharger">
        <SectionTitle>Télécharger le Livre Blanc</SectionTitle>
        <p className="text-muted-foreground mb-8 pl-6">Gratuit, libre de diffusion, sans inscription préalable. Partagez-le autour de vous.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <a href="/documents/livre-blanc-oscar-complet.pdf" download onClick={() => trackDownload("livre-blanc-complet", "Livre Blanc OSCAR complet")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-senegal-green/10 p-4 rounded-xl group-hover:bg-senegal-green/20 transition-colors">
                  <BookOpen className="h-8 w-8 text-senegal-green" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Version complète</h3>
                  <p className="text-sm text-muted-foreground mb-3">Le document intégral avec toutes les annexes, analyses et feuilles de route.</p>
                  <Badge variant="secondary" className="text-xs">Document complet (.pdf)</Badge>
                </div>
                <Download className="h-5 w-5 text-muted-foreground mt-1" />
              </CardContent>
            </Card>
          </a>
          <a href="/documents/livre-blanc-oscar-court.pdf" download onClick={() => trackDownload("livre-blanc-court", "Livre Blanc OSCAR version courte")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-senegal-gold/10 p-4 rounded-xl group-hover:bg-senegal-gold/20 transition-colors">
                  <Zap className="h-8 w-8 text-senegal-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Version de synthèse</h3>
                  <p className="text-sm text-muted-foreground mb-3">L&apos;essentiel du manifeste en 30 minutes de lecture. Idéal pour partager.</p>
                  <Badge variant="secondary" className="text-xs">Synthèse 8 pages (.pdf)</Badge>
                </div>
                <Download className="h-5 w-5 text-muted-foreground mt-1" />
              </CardContent>
            </Card>
          </a>
        </div>

        <h3 className="text-xl font-bold mb-2 pl-2">Annexes techniques</h3>
        <p className="text-sm text-muted-foreground mb-4 pl-2">Documents juridiques et opérationnels du modèle OSCAR — téléchargeables séparément.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { letter: "A", title: "Charte de Gouvernance", desc: "Projet de loi constitutionnelle", file: "annexe-a-charte-gouvernance.pdf" },
            { letter: "B", title: "Contrat de Performance", desc: "Pour Premier ministre et ministres", file: "annexe-b-contrat-performance.pdf" },
            { letter: "C", title: "Contrat Citoyen", desc: "Version juridique simplifiée", file: "annexe-c-contrat-citoyen.pdf" },
            { letter: "D", title: "Indicateurs du TBN", desc: "Tableau de bord de la Nation", file: "annexe-d-indicateurs-tbn.pdf" },
            { letter: "E", title: "Calendrier de transition", desc: "Feuille de route 2026–2035", file: "annexe-e-calendrier-transition.pdf" },
          ].map((a) => (
            <a key={a.letter} href={`/documents/${a.file}`} download onClick={() => trackDownload(`annexe-${a.letter.toLowerCase()}`, a.title)}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="bg-senegal-green/10 rounded-lg w-10 h-10 flex items-center justify-center font-bold text-senegal-green text-sm shrink-0 group-hover:bg-senegal-green group-hover:text-white transition-colors">{a.letter}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{a.title}</h4>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </Section>

      <Separator className="max-w-6xl mx-auto" />

      {/* ═══ CAS D'USAGE ═══ */}
      <Section id="cas-usage">
        <SectionTitle color="gold">OSCAR en action : cas d&apos;usage concrets</SectionTitle>
        <p className="text-muted-foreground mb-8 pl-6">Comment le modèle OSCAR transforme le quotidien des Sénégalais — en particulier la jeunesse.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {useCases.map((uc, i) => (
            <motion.div key={uc.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-senegal-green mt-0.5">{uc.icon}</div>
                    <div>
                      <Badge variant="outline" className="text-[10px] mb-1 border-senegal-gold/50 text-senegal-dark">{uc.tag}</Badge>
                      <h3 className="font-bold">{uc.title}</h3>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="bg-red-50 rounded-lg p-3 border-l-[3px] border-senegal-red">
                      <div className="text-[10px] font-bold text-senegal-red uppercase mb-0.5">Avant OSCAR</div>
                      <p className="text-muted-foreground">{uc.before}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border-l-[3px] border-senegal-green">
                      <div className="text-[10px] font-bold text-senegal-green uppercase mb-0.5">Avec OSCAR</div>
                      <p className="text-muted-foreground">{uc.after}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Separator className="max-w-6xl mx-auto" />

      {/* ═══ CRITIQUES ET DÉBATS ═══ */}
      <Section id="debats">
        <SectionTitle color="red">Critiques et Débats</SectionTitle>
        <p className="text-muted-foreground mb-8 pl-6">La transparence est au coeur d&apos;OSCAR. Voici les questions difficiles — et les réponses honnêtes.</p>
        <div className="space-y-3 max-w-3xl">
          {faqs.map((faq, i) => (
            <Card key={i} className="overflow-hidden">
              <button className="w-full text-left p-4 flex items-start justify-between gap-3" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-senegal-red mt-0.5 shrink-0" />
                  <span className="font-semibold text-sm md:text-base">{faq.q}</span>
                </div>
                {openFaq === i ? <ChevronUp className="h-4 w-4 shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 shrink-0 mt-1" />}
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <div className="px-4 pb-4 pl-12 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </Section>

      {/* ═══ FORUM CITOYEN ═══ */}
      <Section id="forum" className="bg-muted/30">
        <SectionTitle>Forum Citoyen</SectionTitle>
        <p className="text-muted-foreground mb-8 pl-6">Un espace ouvert à tous ceux qui aspirent au changement de paradigme. Votre contribution enrichit la réflexion collective.</p>
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Send className="h-5 w-5 text-senegal-green" />Publier une contribution</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><Label className="text-xs">Votre nom *</Label><Input placeholder="Ex : Aminata Diop" value={forumAuthor} onChange={(e) => setForumAuthor(e.target.value)} /></div>
                <div><Label className="text-xs">Région</Label><Select value={forumRegion} onValueChange={setForumRegion}><SelectTrigger><SelectValue placeholder="Votre région" /></SelectTrigger><SelectContent>{REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-xs">Thème *</Label><Select value={forumTheme} onValueChange={setForumTheme}><SelectTrigger><SelectValue placeholder="Choisir un thème" /></SelectTrigger><SelectContent>{THEMES_FORUM.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-xs">Votre contribution * (min. 20 car.)</Label><Textarea placeholder="Partagez votre réflexion, votre idée, votre critique constructive..." rows={4} value={forumContent} onChange={(e) => setForumContent(e.target.value)} /></div>
                <Button className="w-full bg-senegal-green hover:bg-senegal-green/90 text-white rounded-full" onClick={handleForumSubmit} disabled={forumSubmitting}>{forumSubmitting ? "Publication..." : "Publier ma contribution"}</Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {forumPosts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Aucune contribution pour le moment.</p>
                  <p className="text-xs mt-1">Soyez le premier à enrichir le débat !</p>
                </div>
              )}
              {forumPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div><span className="font-semibold text-sm">{post.author}</span>{post.region && <Badge variant="secondary" className="ml-2 text-[10px]">{post.region}</Badge>}</div>
                      <Badge variant="outline" className="text-[10px] border-senegal-green/30 text-senegal-green shrink-0">{post.theme}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-muted-foreground">{new Date(post.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-senegal-green transition-colors"><ThumbsUp className="h-3.5 w-3.5" /><span>{post.upvotes}</span></button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ ROADMAP ═══ */}
      <Section id="roadmap">
        <SectionTitle color="gold">Feuille de route publique</SectionTitle>
        <p className="text-muted-foreground mb-8 pl-6">Un calendrier clair, des résultats mesurables. Pas de promesses vides — des étapes concrètes vers 2035.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { icon: <Target className="h-5 w-5" />, label: "Réduction délais admin", value: "70%", desc: "d'ici 2032" },
            { icon: <Eye className="h-5 w-5" />, label: "Transparence budgétaire", value: "100%", desc: "en temps réel" },
            { icon: <TrendingUp className="h-5 w-5" />, label: "Indice gouvernance", value: "Top 3", desc: "Afrique d'ici 2035" },
            { icon: <BarChart3 className="h-5 w-5" />, label: "Satisfaction citoyenne", value: ">75%", desc: "d'ici 2033" },
          ].map((ind) => (
            <Card key={ind.label}><CardContent className="p-4 text-center"><div className="text-senegal-green flex justify-center mb-2">{ind.icon}</div><div className="text-2xl font-bold text-senegal-green">{ind.value}</div><div className="text-xs font-medium">{ind.label}</div><div className="text-[10px] text-muted-foreground">{ind.desc}</div></CardContent></Card>
          ))}
        </div>
        <div className="space-y-6">
          {roadmapPhases.map((phase, i) => (
            <motion.div key={phase.phase} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <Card><CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3"><div className={`w-3 h-3 rounded-full ${phase.color}`} /><h3 className="font-bold">{phase.phase}</h3></div>
                <ul className="space-y-2">{phase.items.map((item, j) => <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground"><div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${phase.color}`} />{item}</li>)}</ul>
              </CardContent></Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Separator className="max-w-6xl mx-auto" />

      {/* ═══ ENGAGEMENT ═══ */}
      <Section id="engager" className="bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center"><span className="border-l-4 border-senegal-green pl-4">Je m&apos;engage</span></h2>
          <p className="text-muted-foreground mb-8 text-center px-4">Rejoignez le mouvement citoyen OSCAR. Votre signature est un signal fort : nous voulons un changement de modèle, pas seulement de visages.</p>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Nom complet *</Label><Input placeholder="Ex : Moustapha Fall" value={formName} onChange={(e) => setFormName(e.target.value)} /></div>
                <div><Label>Email *</Label><Input type="email" placeholder="votre@email.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Téléphone (optionnel)</Label><Input type="tel" placeholder="+221 7X XXX XX XX" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} /></div>
                <div><Label>Région *</Label><Select value={formRegion} onValueChange={setFormRegion}><SelectTrigger><SelectValue placeholder="Sélectionnez votre région" /></SelectTrigger><SelectContent>{REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div><Label>Commentaire ou suggestion (optionnel)</Label><Textarea placeholder="Vos idées pour améliorer le projet..." rows={3} value={formComment} onChange={(e) => setFormComment(e.target.value)} /></div>
              <div className="space-y-3">
                <div className="flex items-center gap-2"><Checkbox id="ambassador" checked={formAmbassador} onCheckedChange={(v) => setFormAmbassador(!!v)} /><Label htmlFor="ambassador" className="text-sm font-normal">Je souhaite devenir ambassadeur OSCAR</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="newsletter" checked={formNewsletter} onCheckedChange={(v) => setFormNewsletter(!!v)} /><Label htmlFor="newsletter" className="text-sm font-normal">Recevoir les actualités du mouvement OSCAR</Label></div>
              </div>
              <Button className="w-full bg-senegal-green hover:bg-senegal-green/90 text-white rounded-full text-base py-5" onClick={handleEngagement} disabled={formSubmitting}>{formSubmitting ? "Enregistrement..." : "Je m'engage — Signer le manifeste"}</Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ═══ TÉMOIGNAGES ═══ */}
      <Section>
        <SectionTitle color="gold">Ce qu&apos;ils disent d&apos;OSCAR</SectionTitle>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { text: "Enfin un modèle qui sort de la dénonciation stérile pour proposer des solutions concrètes. Le contrat citoyen change la donne.", author: "M. Diallo", role: "Universitaire, Dakar" },
            { text: "Je suis jeune et je n'attendais plus rien de la politique. OSCAR me redonne espoir. La feuille de route citoyenne, je l'applique déjà dans mon quartier.", author: "A. Ndiaye", role: "Étudiant, Thiès" },
            { text: "La proposition sur la dualité Président-Premier ministre est la solution à la crise de gouvernance que nous vivons. Clair, applicable, révolutionnaire.", author: "Journaliste", role: "Dakar (anonyme)" },
          ].map((t, i) => (
            <Card key={i}><CardContent className="p-5">
              <div className="text-3xl text-senegal-gold/40 font-serif leading-none mb-3">&ldquo;</div>
              <p className="text-sm text-muted-foreground italic leading-relaxed mb-4">{t.text}</p>
              <div><div className="font-semibold text-sm text-senegal-green">{t.author}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>
            </CardContent></Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">D&apos;autres témoignages d&apos;experts et de citoyens seront ajoutés prochainement.</p>
      </Section>

      {/* ═══ À PROPOS + PARTENAIRES ═══ */}
      <Section className="bg-muted/30">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <SectionTitle>À propos du modèle OSCAR</SectionTitle>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed pl-6">
              <p><strong className="text-foreground">OSCAR</strong> (Orienté Résultats, Souverain et Solidaire, Compétent, Agile, Responsable) est un modèle de gouvernance conçu pour le Sénégal et l&apos;Afrique du XXIe siècle. Il s&apos;inspire des réussites du Botswana, de l&apos;Estonie et du Rwanda, tout en s&apos;enracinant dans les valeurs sénégalaises : <em>jom</em> (dignité), <em>kersa</em> (pudeur morale), <em>fit</em> (fiabilité), <em>jamm</em> (paix).</p>
              <p>Le Livre Blanc a été rédigé par <strong className="text-foreground">Moustapha (Oumar) Fall</strong>, auteur indépendant, sans financement public ni privé. Il est diffusé librement pour nourrir le débat national et outiller les citoyens, journalistes, société civile et futurs décideurs.</p>
              <p><strong>Contact :</strong> <a href="mailto:contact@senegal2035.org" className="text-senegal-green hover:underline">contact@senegal2035.org</a></p>
            </div>
          </div>
          <div>
            <SectionTitle color="gold">Partenaires</SectionTitle>
            <div className="pl-6">
              <Card className="mb-4"><CardContent className="p-5 flex items-start gap-4">
                <Building2 className="h-8 w-8 text-senegal-green shrink-0" />
                <div>
                  <h3 className="font-bold">ONG RABEC</h3>
                  <p className="text-sm text-muted-foreground mt-1">Partenaire stratégique du mouvement OSCAR. L&apos;ONG RABEC accompagne la diffusion du Livre Blanc et soutient les initiatives citoyennes sur le terrain.</p>
                  <a href="https://rabec.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-senegal-green font-medium hover:underline mt-2 inline-block">Visiter le site de l'ONG RABEC →</a>
                </div>
              </CardContent></Card>
              <Card><CardContent className="p-5">
                <h3 className="font-bold mb-2 flex items-center gap-2"><Heart className="h-5 w-5 text-senegal-red" />Contributions financières</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">Vos contributions serviront exclusivement à l&apos;organisation de <strong className="text-foreground">panels citoyens</strong> et de <strong className="text-foreground">mobilisations sociales</strong> pour la diffusion d&apos;OSCAR dans les quartiers, afin de promouvoir la nouvelle conscience citoyenne.</p>
                <div className="bg-senegal-gold/10 rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-senegal-dark">Soutenir par Wave ou Orange Money :</p>
                  <p className="text-xl font-black text-senegal-green mt-1 tracking-wide">78 000 00 00</p>
                </div>
                <a href="#transparence" className="text-xs text-senegal-green font-medium hover:underline">Voir les rapports de mobilisations →</a>
              </CardContent></Card>
              <p className="text-xs text-muted-foreground mb-3">Le soutien financier est totalement optionnel et volontaire.</p>
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Statistiques ANSD</span> — Les données chiffrées seront enrichies avec les statistiques officielles de l&apos;Agence Nationale de la Statistique et de la Démographie (ANSD) du Sénégal.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ TRANSPARENCE — RAPPORTS DE MOBILISATIONS ═══ */}
      <Section id="transparence" className="bg-muted/30">
        <SectionTitle color="gold">Transparence — Rapports de mobilisations</SectionTitle>
        <p className="text-muted-foreground mb-8 pl-6 max-w-2xl">Chaque franc collecté est tracé. Voici les rapports de mobilisations organisées pour la diffusion d&apos;OSCAR dans les quartiers.</p>
        <div className="max-w-3xl">
          <Card><CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-senegal-green" />
              <h3 className="font-bold text-lg">Formulaire de rapport de mobilisation</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Après chaque activité de terrain, remplissez ce rapport pour garantir la transparence totale.</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div><Label className="text-xs">Région *</Label><Input placeholder="Ex : Dakar" /></div>
              <div><Label className="text-xs">Département *</Label><Input placeholder="Ex : Dakar Plateau" /></div>
              <div><Label className="text-xs">Commune *</Label><Input placeholder="Ex : Médina" /></div>
              <div><Label className="text-xs">Quartier *</Label><Input placeholder="Ex : Grand Médine" /></div>
              <div><Label className="text-xs">Date de la mobilisation *</Label><Input type="date" /></div>
              <div><Label className="text-xs">Personne focale *</Label><Input placeholder="Nom et téléphone" /></div>
              <div><Label className="text-xs">Nombre de participants</Label><Input type="number" placeholder="0" /></div>
              <div><Label className="text-xs">Type d&apos;activité</Label>
                <Select><SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger><SelectContent>
                  <SelectItem value="panel">Panel citoyen</SelectItem>
                  <SelectItem value="distribution">Distribution Livre Blanc</SelectItem>
                  <SelectItem value="debat">Débat de quartier</SelectItem>
                  <SelectItem value="marche">Marche de sensibilisation</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent></Select>
              </div>
            </div>
            <div><Label className="text-xs">Compte-rendu détaillé *</Label><Textarea placeholder="Décrivez le déroulement, les réactions, les résolutions prises..." rows={4} /></div>
            <Button className="w-full mt-4 bg-senegal-green hover:bg-senegal-green/90 text-white rounded-full">Soumettre le rapport</Button>
          </CardContent></Card>
          <p className="text-xs text-muted-foreground mt-4 text-center">Les rapports soumis seront vérifiés et publiés ci-dessous pour une transparence totale.</p>
        </div>
      </Section>

      {/* ═══ PARTAGEZ + QR ═══ */}
      <Section>
        <div className="max-w-xl mx-auto text-center">
          <SectionTitle>Partagez autour de vous</SectionTitle>
          <p className="text-muted-foreground mb-6 pl-6">Le livre est libre de diffusion. Imprimez-le, envoyez-le, discutez-en. Le changement commence par la connaissance.</p>
          <div className="flex justify-center mb-6">
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm inline-block">
              <QrCode className="h-28 w-28 text-senegal-dark mx-auto" />
              <p className="text-xs text-muted-foreground mt-2">Scannez pour accéder au site</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Ou partagez le lien :</p>
          <div className="inline-flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
            <Globe className="h-4 w-4 text-senegal-green" />
            <span className="font-mono text-sm font-medium">www.senegal2035.org</span>
          </div>
          <div className="flex justify-center gap-3 mt-6">
            {["Facebook", "WhatsApp", "Twitter/X", "TikTok"].map((s) => (
              <a key={s} href="#" className="text-sm text-muted-foreground hover:text-senegal-green transition-colors px-3 py-1.5 rounded-full border border-border hover:border-senegal-green/30">{s}</a>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-senegal-dark text-white/80 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-0.5 font-black text-2xl tracking-tight mb-3">
                <span className="text-senegal-green">O</span><span className="text-senegal-gold">S</span><span className="text-senegal-red">C</span><span className="text-senegal-green">A</span><span className="text-senegal-gold">R</span>
              </div>
              <p className="text-sm opacity-75 leading-relaxed">Un modèle de gouvernance orienté résultats, compétent, agile et responsable pour le Sénégal de 2035.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Navigation</h4>
              <div className="space-y-1.5 text-sm">{NAV_ITEMS.map((item) => <a key={item.href} href={item.href} className="block hover:text-senegal-gold transition-colors">{item.label}</a>)}</div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <p className="text-sm mb-2"><a href="mailto:contact@senegal2035.org" className="text-senegal-gold hover:underline">contact@senegal2035.org</a></p>
              <p className="text-xs opacity-60">Le Sénégal de 2035 ne se fera pas sans vous.<br />Ne restez pas spectateur.</p>
            </div>
          </div>
          <Separator className="bg-white/10 mb-6" />
          <p className="text-center text-xs opacity-50">Livre Blanc OSCAR — Sénégal 2029-2035 — Diffusion libre et gratuite — 2026 — Par Moustapha (Oumar) Fall</p>
        </div>
        <div className="h-1 bg-gradient-to-r from-senegal-green via-senegal-gold to-senegal-red" />
      </footer>
    </div>
  );
}