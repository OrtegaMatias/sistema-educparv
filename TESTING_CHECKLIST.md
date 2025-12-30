# Testing Checklist - Sistema Educación Parvularia

## ✅ UX Improvements Implemented

### 1. Toast Notification System
- [ ] Welcome toast appears on page load
- [ ] Creating a unit shows success toast (instead of alert)
- [ ] Deleting items shows confirmation dialog (instead of confirm)
- [ ] Error scenarios show error toast
- [ ] Toasts auto-dismiss after 5 seconds
- [ ] Multiple toasts stack properly
- [ ] Toast close button works

### 2. Stepper/Wizard for Objectives
- [ ] Stepper shows 5 steps clearly
- [ ] Step 1: Select Ámbito and Núcleo
- [ ] Step 2: Select Objetivos de Aprendizaje (OA)
- [ ] Step 3: Select OAT específicos del núcleo
- [ ] Step 4: Write objective and indicators
- [ ] Step 5: Review summary before saving
- [ ] "Siguiente" button validates current step
- [ ] "Anterior" button goes back
- [ ] Completed steps show checkmark
- [ ] Can't proceed without required fields

### 3. Empty States
- [ ] Empty units section shows friendly message with icon
- [ ] Empty objectives section shows friendly message
- [ ] Empty experiences section shows friendly message
- [ ] Empty states have clear CTAs
- [ ] Empty planificación shows helpful message

### 4. Validation & Feedback
- [ ] Unit name required validation
- [ ] Objective fields validate in real-time
- [ ] Toast appears for validation errors
- [ ] Success feedback on save
- [ ] Delete confirmation dialog works

### 5. Alerts & Tooltips
- [ ] Info alert shows in objectives section
- [ ] Tooltips appear on hover for help icons (?)
- [ ] Alert shows OAT specific to selected núcleo
- [ ] Tooltips explain technical terms (OA, OAT)

### 6. Visual Components
- [ ] Stepper visual styling matches shadcn
- [ ] Badges show correct variants (default, secondary, outline)
- [ ] Cards have hover states
- [ ] Buttons follow hierarchy (max 1 primary per section)
- [ ] Dialog modals have proper backdrop
- [ ] Colors match Valle del Itata palette (#2C4C9A)

### 7. Responsive Design
- [ ] Works on mobile (< 640px)
- [ ] Works on tablet (640px - 1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Stepper adapts on mobile
- [ ] Modals are fullscreen on mobile
- [ ] Grid layouts adapt properly

### 8. Accessibility
- [ ] All inputs have visible labels
- [ ] Focus visible on tab navigation
- [ ] ARIA labels present on icon buttons
- [ ] Keyboard navigation works
- [ ] Tooltips accessible via keyboard

## 🔍 Critical Flows to Test

### Flow 1: Create Unit
1. Open "Gestión Unidades" tab
2. Click "Agregar Unidad"
3. Fill unit name
4. (Optional) Add dates and efemérides
5. Click "Guardar"
6. ✅ Toast should appear (NOT alert)
7. ✅ Unit card should appear

### Flow 2: Create Objective (Full Stepper)
1. Open "Objetivos de Aprendizaje" tab
2. Stepper should show 5 steps
3. **Step 1**: Select Ámbito → Select Núcleo → Click "Siguiente"
4. **Step 2**: Select at least 1 OA → Click "Siguiente"
5. **Step 3**: Select at least 1 OAT → Click "Siguiente"
6. **Step 4**: Write objective text + indicators → Click "Siguiente"
7. **Step 5**: Review summary → Click "Guardar Objetivo"
8. ✅ Toast should appear
9. ✅ Stepper resets to step 1
10. ✅ Objective appears in saved list

### Flow 3: Create Experience
1. Open "Experiencias de Aprendizaje" tab
2. Select unit
3. Select saved objective(s)
4. Fill experience details
5. Click "Guardar"
6. ✅ Toast appears
7. ✅ Experience card appears

### Flow 4: Generate Planificación
1. Open "Planificación Pedagógica" tab
2. Select unit with objectives and experiences
3. View generated planificación
4. ✅ Table renders with all data
5. ✅ Objetivo, Experiencia, Indicadores columns populated

### Flow 5: Delete Item
1. Try to delete a unit/objective/experience
2. ✅ Confirmation dialog appears (NOT browser confirm)
3. Click "Cancelar" → Nothing happens
4. Click "Eliminar" → Toast confirms deletion

## 🐛 Common Issues to Check

- [ ] No JavaScript errors in console
- [ ] No CSS rendering issues
- [ ] All buttons clickable
- [ ] No overlapping modals
- [ ] Toasts don't stack infinitely
- [ ] Data persists after refresh (localStorage)
- [ ] OAT filtering works per núcleo
- [ ] Efemérides load correctly

## 📱 Browser Compatibility

Test in:
- [ ] Chrome/Edge (primary)
- [ ] Safari
- [ ] Firefox
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## ✨ Professional Polish Checks

- [ ] No `alert()` or `confirm()` anywhere
- [ ] All feedback via toast system
- [ ] Animations smooth (300ms)
- [ ] Colors match institutional palette
- [ ] Typography follows ESTILOS.md scale
- [ ] Spacing consistent
- [ ] Loading states show skeleton (if implemented)
- [ ] No typos in Spanish text

---

## 🎯 Success Criteria

The MVP is ready when:
1. ✅ Zero JavaScript alerts/confirms
2. ✅ All flows use stepper/wizard
3. ✅ Empty states are friendly
4. ✅ Validation provides clear feedback
5. ✅ Design matches shadcn/ui patterns
6. ✅ Institutional colors applied correctly
7. ✅ Responsive on all devices
8. ✅ Accessible (keyboard + screen reader)

---

## 📝 Notes for Back+Front Migration

When converting to full stack:
- Toast system can use Sonner or shadcn Toast
- Stepper can use shadcn Steps or custom component
- Empty states can be componentized
- Validation can move to schema (Zod)
- localStorage → Backend API
- All UI patterns are ready for React/Vue/Svelte
