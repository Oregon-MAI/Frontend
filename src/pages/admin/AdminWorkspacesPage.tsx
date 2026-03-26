import { useState, useEffect } from 'react'
import type { Resource, ResourceStatus } from '../../types/resource'
import {
  getResourcesList,
  createResource,
  updateResource,
  deleteResource,
  changeResourceStatus,
} from '../../api/resourceApi'
import styles from './AdminWorkspacesPage.module.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 7

function statusLabel(s: ResourceStatus): { text: string; cls: string } {
  switch (s) {
    case 'RESOURCE_STATUS_AVAILABLE':
      return { text: 'Доступно', cls: 'available' }
    case 'RESOURCE_STATUS_OCCUPIED':
      return { text: 'Занято', cls: 'occupied' }
    default:
      return { text: 'Недоступно', cls: 'maintenance' }
  }
}

function deriveZone(name: string): { zone: string; zoneName: string } {
  const char = name.charAt(0).toUpperCase()
  const zoneNames: Record<string, string> = {
    A: 'Разработка',
    B: 'Аналитика',
    C: 'Менеджмент',
    D: 'Дизайн',
  }
  return { zone: `Зона ${char}`, zoneName: zoneNames[char] ?? 'Общая зона' }
}

function parseAmenities(r: Resource): string {
  const list: string[] = []
  if (r.workspace?.has_monitor) list.push('Монитор')
  return list.join(', ')
}

// ─── Modal form state ─────────────────────────────────────────────────────────

interface WorkspaceForm {
  id: string
  zone: string
  floor: string
  wing: string
  amenities: string
  comment: string
  unavailable: boolean
  unavailableFrom: string
  unavailableTo: string
  unavailableReason: string
}

const EMPTY_FORM: WorkspaceForm = {
  id: '',
  zone: '',
  floor: '',
  wing: '',
  amenities: '',
  comment: '',
  unavailable: false,
  unavailableFrom: '',
  unavailableTo: '',
  unavailableReason: '',
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function WorkspaceModal({
  mode,
  initial,
  onSave,
  onClose,
}: {
  mode: 'add' | 'edit'
  initial: WorkspaceForm
  onSave: (form: WorkspaceForm) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState<WorkspaceForm>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof WorkspaceForm, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.id.trim()) { setError('Введите ID места'); return }
    if (!form.zone.trim()) { setError('Введите зону'); return }
    if (!form.floor.trim()) { setError('Введите этаж'); return }
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === 'add' ? 'Добавить рабочее место' : `Изменить место ${initial.id}`}
          </h2>
          <button type="button" className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          {/* ОСНОВНАЯ ИНФОРМАЦИЯ */}
          <div className={styles.formSection}>
            <div className={styles.formSectionLabel}>ОСНОВНАЯ ИНФОРМАЦИЯ</div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ID места *</label>
                <input
                  className={styles.formInput}
                  placeholder="A-49"
                  value={form.id}
                  onChange={e => set('id', e.target.value)}
                  readOnly={mode === 'edit'}
                />
                <span className={styles.formHelper}>Уникальный идентификатор: зона-номер</span>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Зона *</label>
                <input
                  className={styles.formInput}
                  placeholder="Зона А — Разработка"
                  value={form.zone}
                  onChange={e => set('zone', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Этаж *</label>
                <input
                  className={styles.formInput}
                  placeholder="11 этаж"
                  value={form.floor}
                  onChange={e => set('floor', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Крыло / локация</label>
                <input
                  className={styles.formInput}
                  placeholder="Крыло А"
                  value={form.wing}
                  onChange={e => set('wing', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ОСНАЩЕНИЕ */}
          <div className={styles.formSection}>
            <div className={styles.formSectionLabel}>ОСНАЩЕНИЕ</div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Оснащение (через запятую)</label>
              <input
                className={styles.formInput}
                placeholder="Wi-Fi, Монитор, USB-C"
                value={form.amenities}
                onChange={e => set('amenities', e.target.value)}
              />
              <span className={styles.formHelper}>Например: Wi-Fi, Монитор, Клавиатура, Мышь, USB-C, Наушники</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Комментарий администратора</label>
              <textarea
                className={styles.formTextarea}
                placeholder="Особенности места, заметки..."
                value={form.comment}
                onChange={e => set('comment', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* ВРЕМЕННАЯ НЕДОСТУПНОСТЬ */}
          <div className={styles.formSection}>
            <div className={styles.formSectionLabel}>ВРЕМЕННАЯ НЕДОСТУПНОСТЬ</div>

            <div className={styles.toggleRow}>
              <label className={styles.toggleLabel}>
                <div
                  className={`${styles.toggle} ${form.unavailable ? styles.toggleOn : ''}`}
                  onClick={() => set('unavailable', !form.unavailable)}
                  role="switch"
                  aria-checked={form.unavailable}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && set('unavailable', !form.unavailable)}
                >
                  <div className={styles.toggleThumb} />
                </div>
                <span className={styles.toggleText}>Отметить место как временно недоступное</span>
              </label>
            </div>
            <span className={styles.formHelper}>
              При включении место недоступно для бронирования в указанный период. Существующие брони отменятся с уведомлением.
            </span>

            {form.unavailable && (
              <div className={styles.unavailableBlock}>
                <div className={styles.unavailableWarning}>
                  ⚠ Место временно недоступно
                </div>
                <p className={styles.unavailableDesc}>
                  Место заблокировано для бронирования. Имеющиеся брони отменены, пользователи уведомлены.
                </p>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Недоступно с *</label>
                    <input
                      type="date"
                      className={`${styles.formInput} ${styles.formInputOrange}`}
                      value={form.unavailableFrom}
                      onChange={e => set('unavailableFrom', e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Недоступно по *</label>
                    <input
                      type="date"
                      className={`${styles.formInput} ${styles.formInputOrange}`}
                      value={form.unavailableTo}
                      onChange={e => set('unavailableTo', e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Причина</label>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="Причина недоступности..."
                    value={form.unavailableReason}
                    onChange={e => set('unavailableReason', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>

          {error && <div className={styles.formError}>{error}</div>}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnGhost} onClick={onClose}>Отмена</button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : '✓ Сохранить место'}
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminWorkspacesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Resource | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getResourcesList(['RESOURCE_TYPE_WORKSPACE'])
      .then(list => setResources(list))
      .catch(() => setError('Не удалось загрузить рабочие места'))
      .finally(() => setLoading(false))
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const totalPages = Math.max(1, Math.ceil(resources.length / PAGE_SIZE))
  const pageItems = resources.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resourceToForm(r: Resource): WorkspaceForm {
    const parts = r.location.split('·').map(s => s.trim())
    return {
      id: r.name,
      zone: deriveZone(r.name).zone,
      floor: parts[0] ?? '',
      wing: parts[1] ?? '',
      amenities: parseAmenities(r),
      comment: '',
      unavailable:
        r.status === 'RESOURCE_STATUS_MAINTENANCE' ||
        r.status === 'RESOURCE_STATUS_EMERGENCY',
      unavailableFrom: '',
      unavailableTo: '',
      unavailableReason: '',
    }
  }

  async function handleAdd(form: WorkspaceForm) {
    const location = [form.floor, form.wing].filter(Boolean).join(' · ')
    const hasMonitor = form.amenities.toLowerCase().includes('монитор')
    const created = await createResource({
      name: form.id,
      type: 'RESOURCE_TYPE_WORKSPACE',
      location,
      workspace: { has_monitor: hasMonitor },
    })
    if (form.unavailable) {
      await changeResourceStatus({
        resource_id: created.resource_id,
        status: 'RESOURCE_STATUS_MAINTENANCE',
        reason: form.unavailableReason || 'Временно недоступно',
      })
      created.status = 'RESOURCE_STATUS_MAINTENANCE'
    }
    setResources(prev => [created, ...prev])
    showToast(`Место ${form.id} добавлено`)
  }

  async function handleEdit(form: WorkspaceForm) {
    if (!editTarget) return
    const location = [form.floor, form.wing].filter(Boolean).join(' · ')
    const hasMonitor = form.amenities.toLowerCase().includes('монитор')
    const updated = await updateResource(
      editTarget.resource_id,
      {
        location,
        workspace: { has_monitor: hasMonitor },
      },
      ['location', 'workspace'],
    )
    if (form.unavailable && editTarget.status === 'RESOURCE_STATUS_AVAILABLE') {
      await changeResourceStatus({
        resource_id: editTarget.resource_id,
        status: 'RESOURCE_STATUS_MAINTENANCE',
        reason: form.unavailableReason || 'Временно недоступно',
      })
      updated.status = 'RESOURCE_STATUS_MAINTENANCE'
    } else if (!form.unavailable && editTarget.status === 'RESOURCE_STATUS_MAINTENANCE') {
      await changeResourceStatus({
        resource_id: editTarget.resource_id,
        status: 'RESOURCE_STATUS_AVAILABLE',
        reason: '',
      })
      updated.status = 'RESOURCE_STATUS_AVAILABLE'
    }
    setResources(prev => prev.map(r => (r.resource_id === updated.resource_id ? updated : r)))
    showToast(`Место ${form.id} обновлено`)
  }

  async function handleDelete(id: string) {
    await deleteResource(id)
    setResources(prev => prev.filter(r => r.resource_id !== id))
    setDeleteConfirm(null)
    showToast('Место удалено')
  }

  const sl = statusLabel

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Рабочие места</h1>
          <p className={styles.pageSubtitle}>{resources.length} ресурсов · БЦ «Арена»</p>
        </div>
        <div className={styles.headerRight}>
          <button type="button" className={styles.btnFilter}>Все этажи ▾</button>
          <button type="button" className={styles.btnFilter}>Все статусы ▾</button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => { setEditTarget(null); setShowModal(true) }}
          >
            <IconPlus /> Добавить место
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingMsg}>Загрузка...</div>
        ) : error ? (
          <div className={styles.errorMsg}>{error}</div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>ЗОНА</th>
                  <th className={styles.th}>ЭТАЖ · ЛОКАЦИЯ</th>
                  <th className={styles.th}>ОСНАЩЕНИЕ</th>
                  <th className={styles.th}>СТАТУС</th>
                  <th className={styles.th}>ДЕЙСТВИЯ</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map(r => {
                  const { zone, zoneName } = deriveZone(r.name)
                  const amenities = parseAmenities(r)
                  const { text, cls } = sl(r.status)
                  return (
                    <tr key={r.resource_id} className={styles.tr}>
                      <td className={styles.td}>
                        <span className={styles.idLink}>{r.name}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.zoneName}>{zone}</span>
                        <span className={styles.zoneSub}>{zoneName}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.location}>{r.location || '—'}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.amenities}>{amenities || '—'}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={`${styles.statusBadge} ${styles[`status_${cls}`]}`}>
                          ● {text}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            className={styles.btnEdit}
                            onClick={() => { setEditTarget(r); setShowModal(true) }}
                          >
                            Изменить
                          </button>
                          <button
                            type="button"
                            className={styles.btnDelete}
                            onClick={() => setDeleteConfirm(r.resource_id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>Рабочие места не найдены</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Footer / Pagination */}
            <div className={styles.tableFooter}>
              <span className={styles.footerInfo}>
                Показано {pageItems.length} из {resources.length}
              </span>
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <IconChevronLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`${styles.pageBtn} ${page === n ? styles.pageBtnActive : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <IconChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit modal */}
      {showModal && (
        <WorkspaceModal
          mode={editTarget ? 'edit' : 'add'}
          initial={editTarget ? resourceToForm(editTarget) : EMPTY_FORM}
          onSave={editTarget ? handleEdit : handleAdd}
          onClose={() => { setShowModal(false); setEditTarget(null) }}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <>
          <div className={styles.overlay} onClick={() => setDeleteConfirm(null)} />
          <div className={styles.confirmModal}>
            <p className={styles.confirmText}>Удалить это рабочее место?</p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => setDeleteConfirm(null)}
              >
                Отмена
              </button>
              <button
                type="button"
                className={styles.btnDanger}
                onClick={() => handleDelete(deleteConfirm)}
              >
                Удалить
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}
