import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BarChart2, 
  LineChart, 
  Info, 
  Calculator, 
  CheckCircle2,
  Presentation as PresentationIcon,
  TrendingUp,
  ScatterChart as ScatterIcon,
  IceCream,
  Sun,
  Waves,
  BookOpen,
  GraduationCap,
  Coins,
  Stethoscope,
  Trophy,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  ComposedChart,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

// --- Math Utilities ---

const generateRandomData = (count: number, slope: number, intercept: number, noise: number) => {
  return Array.from({ length: count }, (_, i) => {
    const x = Math.random() * 100;
    const y = slope * x + intercept + (Math.random() - 0.5) * noise;
    return { x, y };
  });
};

const calculateLinearRegression = (data: { x: number, y: number }[]) => {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0, r2: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (const point of data) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumX2 += point.x * point.x;
    sumY2 += point.y * point.y;
  }

  const denominator = (n * sumX2 - sumX * sumX);
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // R2 calculation
  const yMean = sumY / n;
  let ssTot = 0; // Total sum of squares
  let ssRes = 0; // Residual sum of squares
  for (const point of data) {
    const yPred = slope * point.x + intercept;
    ssTot += Math.pow(point.y - yMean, 2);
    ssRes += Math.pow(point.y - yPred, 2);
  }
  const r2 = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

  return { slope, intercept, r2 };
};

// --- Components ---

const Slide = ({ children, isActive }: { children: React.ReactNode, isActive: boolean, key?: React.Key }) => {
  if (!isActive) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8"
    >
      {children}
    </motion.div>
  );
};

export default function Presentation() {
  const [activePresentation, setActivePresentation] = useState<'menu' | 'regresion' | 'dispersion'>('menu');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const sampleData = useMemo(() => generateRandomData(40, 0.8, 20, 30), []);
  const regression = useMemo(() => calculateLinearRegression(sampleData), [sampleData]);

  const regressionSlides = [
    // 1. Portada Regresión
    {
      id: 'portada-regresion',
      content: (
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <div className="space-y-2">
              <div className="h-1 w-24 bg-primary" />
              <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary">Presentación Académica</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
              Regresión <br />
              <span className="text-primary">Lineal</span> Simple
            </h1>
            <p className="text-2xl font-light text-muted-foreground max-w-md">
              Análisis de relaciones y modelos predictivos en estadística.
            </p>
          </div>
          <div className="flex flex-col justify-end h-full space-y-8 pb-12">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Materia</p>
              <p className="text-2xl font-medium">Probabilidad y Estadística</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Expositores</p>
              <p className="text-2xl font-medium">Equipo 4</p>
            </div>
          </div>
        </div>
      )
    },
    // 2. Regresión Lineal Simple Definición
    {
      id: 'regresion-def',
      content: (
        <div className="w-full max-w-6xl space-y-16">
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <div className="space-y-6">
              <h2 className="text-6xl font-black tracking-tighter text-primary uppercase">El Modelo</h2>
              <p className="text-2xl font-light leading-snug">
                Buscamos la <span className="font-bold underline decoration-primary decoration-4">línea recta</span> que mejor represente la tendencia de los datos.
              </p>
            </div>
            <div className="bg-muted/30 p-8 rounded-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">La Ecuación</p>
              <p className="text-6xl font-serif tracking-tighter">
                y = <span className="text-primary">m</span>x + <span className="text-primary/50">b</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "y", title: "Predicción", desc: "El valor que queremos estimar." },
              { label: "m", title: "Pendiente", desc: "La inclinación de la recta." },
              { label: "b", title: "Intercepto", desc: "Donde la línea toca el eje Y." }
            ].map((item, i) => (
              <div key={i} className="space-y-2 border-t-2 border-muted pt-4">
                <span className="text-3xl font-serif text-primary">{item.label}</span>
                <h4 className="text-lg font-bold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // 3. Mínimos Cuadrados
    {
      id: 'minimos-cuadrados',
      content: (
        <div className="max-w-4xl w-full space-y-12">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tight">Mínimos Cuadrados</h2>
            <p className="text-xl font-light text-muted-foreground italic">¿Cómo definimos qué línea es la "mejor"?</p>
          </div>
          <div className="bg-primary p-12 rounded-[3rem] text-primary-foreground shadow-2xl">
            <p className="text-3xl font-medium leading-tight mb-8">
              Minimizamos la suma de los errores al cuadrado.
            </p>
            <div className="grid md:grid-cols-2 gap-12 text-left opacity-90">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">El Concepto</p>
                <p className="text-lg">Al elevar al cuadrado, evitamos que los errores positivos y negativos se cancelen entre sí.</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">El Resultado</p>
                <p className="text-lg">Obtenemos la línea que está, en promedio, lo más cerca posible de todos los puntos.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // 4. Visualización de la Línea de Mejor Ajuste
    {
      id: 'mejor-ajuste',
      content: (
        <div className="w-full max-w-6xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter uppercase">La Línea de Mejor Ajuste</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              El algoritmo calcula automáticamente la posición matemática perfecta que minimiza la distancia a todos los puntos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-8">
              <div className="p-8 bg-primary text-primary-foreground rounded-[2rem] space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Ecuación Calculada</p>
                <p className="text-4xl font-serif italic">
                  y = {regression.slope.toFixed(2)}x + {regression.intercept.toFixed(1)}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold">R²</div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest">Coeficiente de Determinación</p>
                    <p className="text-2xl font-black">{(regression.r2 * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Este valor indica qué tan bien la línea explica la variabilidad de los datos. Un 100% sería un ajuste perfecto.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 h-[500px] bg-white rounded-[2.5rem] border-2 border-muted p-8 relative overflow-hidden">
              <div className="absolute top-8 left-8 z-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border rounded-full shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest">Modelo Matemático</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                  <XAxis type="number" dataKey="x" domain={[0, 100]} hide />
                  <YAxis type="number" dataKey="y" domain={[0, 150]} hide />
                  <Scatter name="Datos" data={sampleData} fill="#cbd5e1" />
                  <Line 
                    type="linear" 
                    data={[
                      { x: 0, y: regression.intercept },
                      { x: 100, y: regression.slope * 100 + regression.intercept }
                    ]} 
                    dataKey="y" 
                    stroke="var(--color-primary)" 
                    strokeWidth={8} 
                    dot={false} 
                    activeDot={false}
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )
    },
    // 5. Coeficiente de Determinación R2
    {
      id: 'r-cuadrado',
      content: (
        <div className="grid md:grid-cols-2 gap-20 items-center max-w-6xl w-full">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-6xl font-black tracking-tighter uppercase">R-Cuadrado</h2>
              <p className="text-2xl font-light text-muted-foreground leading-tight">
                Mide qué tan fiel es la línea a la realidad de los datos.
              </p>
            </div>
            <div className="space-y-8">
              {[
                { val: "1.0", text: "Ajuste Perfecto", desc: "Todos los puntos están sobre la línea." },
                { val: "0.0", text: "Sin Ajuste", desc: "La línea no explica nada del fenómeno." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <span className="text-4xl font-serif italic text-primary/30">{item.val}</span>
                  <div className="space-y-1">
                    <p className="font-bold text-xl">{item.text}</p>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex flex-col items-center justify-center p-12 bg-muted/10 rounded-[4rem] border-2 border-muted">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-12">Resultado Actual</p>
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted/20" />
                <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={753.98} strokeDashoffset={753.98 * (1 - regression.r2)} className="text-primary transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black tracking-tighter text-primary">{(regression.r2 * 100).toFixed(0)}%</span>
                <span className="text-sm font-bold opacity-40">PRECISIÓN</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // 6. Supuestos de la Regresión
    {
      id: 'supuestos',
      content: (
        <div className="w-full max-w-5xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tight">Supuestos</h2>
            <p className="text-xl font-light text-muted-foreground">Condiciones críticas para la validez del modelo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { title: "Linealidad", desc: "La relación debe ser una línea recta." },
              { title: "Independencia", desc: "Los errores no deben estar relacionados." },
              { title: "Homocedasticidad", desc: "Varianza constante en los errores." },
              { title: "Normalidad", desc: "Los residuos siguen una curva normal." }
            ].map((s, i) => (
              <div key={i} className="space-y-2 border-l-2 border-primary pl-6 py-2">
                <h4 className="text-xl font-bold">{s.title}</h4>
                <p className="text-muted-foreground font-light leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // 7. Conclusión Regresión
    {
      id: 'conclusion-regresion',
      content: (
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-7xl font-black tracking-tighter leading-none uppercase">
              Fin de <br />
              <span className="text-primary">Regresión</span>
            </h2>
            <div className="h-2 w-32 bg-primary" />
            <p className="text-xl text-muted-foreground font-light">
              El modelado predictivo es la base de la ciencia de datos moderna.
            </p>
            <Button size="lg" onClick={() => setActivePresentation('menu')} className="rounded-full px-10 h-14 text-lg font-bold">
              Volver al Menú
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              "Modelado predictivo",
              "Análisis de precisión",
              "Mínimos cuadrados",
              "Toma de decisiones"
            ].map((text, i) => (
              <div key={i} className="p-6 border-b-2 border-muted flex items-center justify-between group hover:border-primary transition-colors">
                <span className="text-2xl font-bold">{text}</span>
                <CheckCircle2 className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const dispersionSlides = [
    // 1. Portada Dispersión
    {
      id: 'portada-dispersion',
      content: (
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <div className="space-y-2">
              <div className="h-1 w-24 bg-primary" />
              <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary">Presentación Académica</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
              Diagramas de <br />
              <span className="text-primary">Dispersión</span>
            </h1>
            <p className="text-2xl font-light text-muted-foreground max-w-md">
              Visualización de datos y análisis de correlación.
            </p>
          </div>
          <div className="flex flex-col justify-end h-full space-y-8 pb-12">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Materia</p>
              <p className="text-2xl font-medium">Probabilidad y Estadística</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Expositores</p>
              <p className="text-2xl font-medium">Equipo 4</p>
            </div>
          </div>
        </div>
      )
    },
    // 2. ¿Qué es un Diagrama de Dispersión?
    {
      id: 'dispersion-def',
      content: (
        <div className="grid md:grid-cols-2 gap-16 items-start max-w-6xl w-full">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold tracking-tight">Diagrama de <br />Dispersión</h2>
              <div className="h-1 w-12 bg-primary" />
            </div>
            <p className="text-xl leading-relaxed text-muted-foreground font-light">
              Es la representación visual de la relación entre dos variables. Cada punto en el plano cartesiano es un dato real.
            </p>
            <div className="space-y-6">
              {[
                { label: "Eje X", text: "Variable Independiente" },
                { label: "Eje Y", text: "Variable Dependiente" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">{item.label}</span>
                  <span className="text-lg font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[450px] w-full bg-muted/20 rounded-3xl p-8">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis type="number" dataKey="x" hide />
                <YAxis type="number" dataKey="y" hide />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Datos" data={sampleData} fill="var(--color-primary)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    },
    // 3. Tipos de Correlación
    {
      id: 'correlacion',
      content: (
        <div className="w-full max-w-6xl space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Tipos de Correlación</h2>
            <p className="text-xl text-muted-foreground">¿Cómo se mueven las variables juntas?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "Positiva", 
                desc: "Al aumentar X, también aumenta Y.", 
                color: "text-blue-500",
                data: Array.from({length: 20}, (_, i) => ({x: i, y: i + Math.random() * 5}))
              },
              { 
                title: "Negativa", 
                desc: "Al aumentar X, disminuye Y.", 
                color: "text-red-500",
                data: Array.from({length: 20}, (_, i) => ({x: i, y: 20 - i + Math.random() * 5}))
              },
              { 
                title: "Nula", 
                desc: "No hay un patrón claro entre X e Y.", 
                color: "text-gray-500",
                data: Array.from({length: 20}, (_, i) => ({x: Math.random() * 20, y: Math.random() * 20}))
              }
            ].map((type, i) => (
              <Card key={i} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className={cn("text-2xl", type.color)}>{type.title}</CardTitle>
                  <CardDescription>{type.desc}</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <XAxis type="number" dataKey="x" hide />
                      <YAxis type="number" dataKey="y" hide />
                      <Scatter data={type.data} fill="currentColor" className={type.color} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    // 4. Valores Atípicos (Outliers)
    {
      id: 'outliers',
      content: (
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl w-full">
          <div className="space-y-8">
            <h2 className="text-5xl font-bold tracking-tight">Valores <br />Atípicos</h2>
            <p className="text-xl font-light text-muted-foreground leading-relaxed">
              Un solo dato extremo puede distorsionar completamente la realidad del modelo.
            </p>
            <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100">
              <p className="text-red-600 font-bold text-sm uppercase tracking-widest mb-2">Efecto</p>
              <p className="text-red-800 font-medium">Reduce la precisión y sesga la pendiente.</p>
            </div>
          </div>
          <div className="h-[400px] w-full bg-muted/10 rounded-3xl p-6">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis type="number" dataKey="x" domain={[0, 100]} hide />
                <YAxis type="number" dataKey="y" domain={[0, 150]} hide />
                <Tooltip />
                <Scatter name="Datos" data={[...sampleData.slice(0, 15), {x: 90, y: 10}]} fill="#cbd5e1" />
                <Scatter name="Outlier" data={[{x: 90, y: 10}]} fill="#ef4444" />
                <Line 
                  type="monotone" 
                  data={[{x: 0, y: 40}, {x: 100, y: 30}]} 
                  dataKey="y" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    },
    // 5. Correlación vs Causalidad
    {
      id: 'causalidad',
      content: (
        <div className="w-full max-w-4xl space-y-16">
          <div className="space-y-4">
            <h2 className="text-7xl font-black tracking-tighter uppercase leading-none">
              Correlación <br />
              <span className="text-primary/20">no es</span> <br />
              Causalidad
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">El Mito</p>
              <p className="text-2xl font-light leading-tight">
                "Si dos cosas suben al mismo tiempo, una debe estar causando la otra."
              </p>
              <div className="h-px w-full bg-muted" />
              <div className="flex items-center gap-4 text-muted-foreground">
                <IceCream className="w-6 h-6" />
                <span className="text-lg">+</span>
                <Waves className="w-6 h-6" />
                <span className="text-sm italic">(Helados y Ahogamientos)</span>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">La Realidad</p>
              <p className="text-2xl font-bold leading-tight">
                Existe una <span className="text-primary italic">variable oculta</span> que explica ambos fenómenos.
              </p>
              <div className="h-px w-full bg-primary/20" />
              <div className="flex items-center gap-4 text-primary">
                <Sun className="w-8 h-8" />
                <span className="text-xl font-bold uppercase tracking-tighter">El Calor del Verano</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-muted/20 rounded-2xl">
            <p className="text-lg font-medium text-center italic">
              "La estadística mide coincidencia, no consecuencia."
            </p>
          </div>
        </div>
      )
    },
    // 6. Ejemplos de Aplicación
    {
      id: 'ejemplos',
      content: (
        <div className="w-full max-w-6xl space-y-16">
          <div className="space-y-4">
            <h2 className="text-6xl font-black tracking-tighter uppercase">Aplicaciones</h2>
            <p className="text-xl font-light text-muted-foreground">La visualización de datos está en todas partes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <TrendingUp className="w-8 h-8" />, title: "Economía", desc: "Precio vs Demanda." },
              { icon: <Stethoscope className="w-8 h-8" />, title: "Medicina", desc: "Dosis vs Recuperación." },
              { icon: <GraduationCap className="w-8 h-8" />, title: "Educación", desc: "Estudio vs Notas." },
              { icon: <Trophy className="w-8 h-8" />, title: "Deportes", desc: "Inversión vs Éxito." }
            ].map((ex, i) => (
              <div key={i} className="space-y-4 group">
                <div className="text-primary transition-transform group-hover:scale-110 duration-300">{ex.icon}</div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold">{ex.title}</h4>
                  <p className="text-sm text-muted-foreground font-light">{ex.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // 7. Conclusión Dispersión
    {
      id: 'conclusion-dispersion',
      content: (
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-7xl font-black tracking-tighter leading-none uppercase">
              Fin de <br />
              <span className="text-primary">Dispersión</span>
            </h2>
            <div className="h-2 w-32 bg-primary" />
            <p className="text-xl text-muted-foreground font-light">
              Visualizar es el primer paso para entender cualquier fenómeno.
            </p>
            <Button size="lg" onClick={() => setActivePresentation('menu')} className="rounded-full px-10 h-14 text-lg font-bold">
              Volver al Menú
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              "Visualización clara",
              "Identificación de patrones",
              "Detección de outliers",
              "Análisis de correlación"
            ].map((text, i) => (
              <div key={i} className="p-6 border-b-2 border-muted flex items-center justify-between group hover:border-primary transition-colors">
                <span className="text-2xl font-bold">{text}</span>
                <CheckCircle2 className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const slides = activePresentation === 'regresion' ? regressionSlides : dispersionSlides;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (activePresentation === 'menu') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, activePresentation]);

  if (activePresentation === 'menu') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="text-6xl font-black tracking-tighter uppercase">Probabilidad y Estadística</h1>
            <p className="text-xl text-muted-foreground">Selecciona el tema de la presentación</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <button 
              onClick={() => { setActivePresentation('dispersion'); setCurrentSlide(0); }}
              className="group p-12 bg-muted/20 hover:bg-primary/5 border-2 border-muted hover:border-primary rounded-[3rem] transition-all text-left space-y-6"
            >
              <ScatterIcon className="w-12 h-12 text-primary" />
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Diagramas de Dispersión</h2>
                <p className="text-muted-foreground">Visualización, tipos de correlación y outliers.</p>
              </div>
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                Comenzar <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            <button 
              onClick={() => { setActivePresentation('regresion'); setCurrentSlide(0); }}
              className="group p-12 bg-muted/20 hover:bg-primary/5 border-2 border-muted hover:border-primary rounded-[3rem] transition-all text-left space-y-6"
            >
              <TrendingUp className="w-12 h-12 text-primary" />
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Regresión Lineal Simple</h2>
                <p className="text-muted-foreground">Modelado, mínimos cuadrados y predicción.</p>
              </div>
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                Comenzar <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">Equipo 4 • 2024</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Header / Progress */}
      <div className="w-full h-1.5 bg-muted flex no-print">
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-full transition-all duration-500",
              i <= currentSlide ? "bg-primary" : "bg-transparent"
            )}
            style={{ width: `${100 / slides.length}%` }}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-grow relative flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <Slide key={`${activePresentation}-${currentSlide}`} isActive={true}>
            {slides[currentSlide].content}
          </Slide>
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="p-8 flex items-center justify-between no-print">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/40">
            {activePresentation === 'regresion' ? 'Regresión' : 'Dispersión'} • {currentSlide + 1} / {slides.length}
          </span>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === currentSlide ? "bg-primary w-8" : "bg-muted w-2"
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActivePresentation('menu')}
            className="rounded-full px-6 font-bold uppercase tracking-widest text-xs"
          >
            Menú
          </Button>
          <div className="w-px h-8 bg-muted mx-2" />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={prevSlide} 
            disabled={currentSlide === 0}
            className="rounded-full hover:bg-primary/5"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button 
            onClick={nextSlide} 
            disabled={currentSlide === slides.length - 1}
            className="rounded-full px-10 h-12 text-sm font-bold uppercase tracking-widest"
          >
            Siguiente
          </Button>
        </div>
      </footer>
    </div>
  );
}
