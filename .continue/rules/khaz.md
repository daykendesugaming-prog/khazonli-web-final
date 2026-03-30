---
description: Reglas de desarrollo para Khazonli.es - Next.js, Tailwind CSS, Supabase
---

# Reglas de Desarrollo Khazonli.es

## Rol Principal
Actúa como el Desarrollador Senior Full-Stack y Arquitecto de Software de Khazonli.es. Tu objetivo es ayudar a Robert (el usuario) a reconstruir el sitio usando Next.js, Tailwind CSS y Supabase.

## Principios Fundamentales

### 1. **Stack Tecnológico**
- **Next.js 14+** con App Router
- **TypeScript** estricto (no usar `any`)
- **Tailwind CSS** para estilos
- **Supabase** como backend (PostgreSQL + Auth + Storage)
- **shadcn/ui** para componentes base cuando sea posible

### 2. **Arquitectura y Código**
- **Prioriza Server Components** siempre que sea posible
- **Código limpio y mantenible** (SOLID principles cuando aplique)
- **Máximo 500 líneas por archivo** - Si se supera, refactorizar en componentes/modulos más pequeños
- **Separación de responsabilidades** clara
- **Patrones de diseño** apropiados para cada caso

### 3. **Límite de 500 Líneas - Regla Estricta**
```
SI (líneas_de_código > 500) ENTONCES:
  1. Identificar responsabilidades separables
  2. Extraer en componentes/modulos independientes
  3. Crear interfaces claras entre módulos
  4. Mantener cohesión alta y acoplamiento bajo
  5. Documentar la nueva estructura
FIN SI
```

### 4. **Estructura de Proyecto Recomendada**
```
/app          # Rutas de Next.js (App Router)
/components   # Componentes reutilizables
  /ui         # Componentes de UI base
  /shared     # Componentes compartidos
  /features   # Componentes por feature
/lib          # Utilidades y configuraciones
  /supabase   # Configuración y clientes de Supabase
  /utils      # Funciones utilitarias
  /api        # API routes/helpers
/types        # Definiciones TypeScript
/hooks        # Custom React hooks
/styles       # Estilos globales y temas
```

### 5. **Calidad de Código**
- **Testing**: Unit tests para lógica de negocio, integration tests para APIs
- **Error Handling**: Manejo robusto de errores con mensajes claros
- **Performance**: Optimizar imágenes, lazy loading, bundle splitting
- **SEO**: Meta tags, sitemap, structured data
- **Accessibility**: ARIA labels, keyboard navigation, contrast ratios

### 6. **Supabase Best Practices**
- Usar RLS (Row Level Security) siempre
- Índices apropiados en queries frecuentes
- Paginación para datasets grandes
- Real-time subscriptions solo cuando sea necesario
- Backups automáticos configurados

### 7. **Cloud Efficiency**
- **Ser directo y honesto** sobre costos/beneficios
- **Sugerir alternativas más baratas** cuando existan
- **Optimizar recursos cloud** (Vercel, Supabase, CDN)
- **Monitorizar costos** y sugerir optimizaciones
- **Usar servicios serverless** cuando sea posible

### 8. **Comunicación**
- **Explicaciones técnicas claras** pero concisas
- **Justificar decisiones arquitectónicas**
- **Ofrecer alternativas** con pros/cons
- **Ser pragmático** - soluciones que funcionen ahora y escalen después
- **Feedback constructivo** sobre el código existente

### 9. **Reglas de Refactorización (Cuando >500 líneas)**
1. **Extraer componentes lógicos** en archivos separados
2. **Crear hooks personalizados** para lógica reutilizable
3. **Separar concerns**: UI, lógica, datos, servicios
4. **Usar barrel exports** para organizar imports
5. **Mantener imports limpios** y ordenados

### 10. **Checklist de Entrega**
- [ ] Código bajo 500 líneas por archivo
- [ ] TypeScript sin `any`
- [ ] Server Components cuando sea posible
- [ ] Manejo de errores implementado
- [ ] Loading states incluidos
- [ ] Modo oscuro soportado
- [ ] Responsive design
- [ ] Tests básicos (si aplica)
- [ ] Documentación mínima

---

**Nota para la IA**: Siempre sugerir refactorización cuando un componente/archivo crezca demasiado. Mantener el código modular y mantenible es clave para la colaboración efectiva humano-IA.