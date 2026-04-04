import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Trash2, X, Check, Plus, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import api from '@/lib/apiServerClient';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx';

// ─── Grouped permissions display ─────────────────────────────────────────────
const RESOURCE_LABELS = {
  leads: 'Leads',
  gallery: 'Galeria',
  testimonials: 'Depoimentos',
  blog: 'Blog',
  users: 'Usuários',
  dashboard: 'Dashboard',
};

const ACTION_LABELS = { read: 'Ler', create: 'Criar', update: 'Editar', delete: 'Excluir' };

const PermissionGrid = ({ permissions, selected, onToggle, readonly = false }) => {
  const grouped = useMemo(() => {
    return permissions.reduce((acc, p) => {
      if (!acc[p.resource]) acc[p.resource] = [];
      acc[p.resource].push(p);
      return acc;
    }, {});
  }, [permissions]);

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([resource, perms]) => (
        <div key={resource} className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted/60 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-secondary flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            {RESOURCE_LABELS[resource] || resource}
          </div>
          <div className="flex flex-wrap gap-2 p-3">
            {perms.map((p) => {
              const isSelected = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={readonly}
                  onClick={() => !readonly && onToggle(p.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150 ${
                    isSelected
                      ? 'bg-primary text-secondary border-primary'
                      : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                  } ${readonly ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                >
                  {ACTION_LABELS[p.action] || p.action}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const UsersRolesTab = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── New user form ──
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);

  // ── New role form ──
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState([]);
  const [creatingRole, setCreatingRole] = useState(false);
  const [showNewRoleForm, setShowNewRoleForm] = useState(false);

  // ── Editing role ──
  const [editingRole, setEditingRole] = useState(null); // { id, name, description, permissions[] }
  const [editRoleName, setEditRoleName] = useState('');
  const [editRoleDescription, setEditRoleDescription] = useState('');
  const [editRolePermissions, setEditRolePermissions] = useState([]);
  const [savingRole, setSavingRole] = useState(false);

  // ── Delete role confirm ──
  const [deletingRoleId, setDeletingRoleId] = useState(null);

  const roleMap = useMemo(() => {
    return roles.reduce((acc, role) => { acc[role.id] = role; return acc; }, {});
  }, [roles]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const usersRes      = await api.fetch('/users');
      const usersJson     = await usersRes.json();
      if (!usersRes.ok) throw new Error(usersJson.error || 'Erro ao buscar usuários');

      const rolesRes      = await api.fetch('/roles');
      const rolesJson     = await rolesRes.json();
      if (!rolesRes.ok) throw new Error(rolesJson.error || 'Erro ao buscar roles');

      const permissionsRes  = await api.fetch('/permissions');
      const permissionsJson = await permissionsRes.json();
      if (!permissionsRes.ok) throw new Error(permissionsJson.error || 'Erro ao buscar permissões');

      setUsers(Array.isArray(usersJson) ? usersJson : []);
      setRoles(Array.isArray(rolesJson) ? rolesJson : []);
      setPermissions(Array.isArray(permissionsJson.permissions) ? permissionsJson.permissions : []);
    } catch (error) {
      toast.error(error.message || 'Erro ao carregar gestão de usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── User actions ──────────────────────────────────────────────────────────
  const createUser = async () => {
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword || !newUserRole) {
      toast.error('Preencha nome, email, senha e role');
      return;
    }
    try {
      setCreatingUser(true);
      const res  = await api.fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserName.trim(), email: newUserEmail.trim(), password: newUserPassword, role_id: newUserRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar usuário');
      toast.success('Usuário criado com sucesso');
      setNewUserName(''); setNewUserEmail(''); setNewUserPassword(''); setNewUserRole('');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Falha ao criar usuário');
    } finally {
      setCreatingUser(false);
    }
  };

  const updateUserRole = async (userId, roleId) => {
    const user = users.find((u) => String(u.id) === String(userId));
    if (!user) return;
    try {
      const res  = await api.fetch(`/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, email: user.email, role_id: roleId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar role');
      toast.success('Role do usuário atualizado');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Falha ao atualizar usuário');
    }
  };

  // ── Role actions ──────────────────────────────────────────────────────────
  const toggleNewPerm = (id) =>
    setNewRolePermissions((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]);

  const toggleEditPerm = (id) =>
    setEditRolePermissions((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]);

  const createRole = async () => {
    if (!newRoleName.trim()) { toast.error('Informe um nome para o role'); return; }
    try {
      setCreatingRole(true);
      const res  = await api.fetch('/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoleName.trim(), description: newRoleDescription.trim() || null, permission_ids: newRolePermissions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar role');
      toast.success('Role criado com sucesso');
      setNewRoleName(''); setNewRoleDescription(''); setNewRolePermissions([]);
      setShowNewRoleForm(false);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Falha ao criar role');
    } finally {
      setCreatingRole(false);
    }
  };

  const startEditRole = (role) => {
    setEditingRole(role);
    setEditRoleName(role.name);
    setEditRoleDescription(role.description || '');
    setEditRolePermissions((role.permissions || []).map((p) => p.id));
  };

  const cancelEditRole = () => {
    setEditingRole(null);
    setEditRoleName(''); setEditRoleDescription(''); setEditRolePermissions([]);
  };

  const saveEditRole = async () => {
    if (!editRoleName.trim()) { toast.error('Nome do role é obrigatório'); return; }
    try {
      setSavingRole(true);
      const res  = await api.fetch(`/roles/${editingRole.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editRoleName.trim(), description: editRoleDescription.trim() || null, permission_ids: editRolePermissions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar role');
      toast.success('Role atualizado com sucesso');
      cancelEditRole();
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Falha ao atualizar role');
    } finally {
      setSavingRole(false);
    }
  };

  const deleteRole = async (roleId) => {
    try {
      const res  = await api.fetch(`/roles/${roleId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir role');
      toast.success('Role excluído');
      setDeletingRoleId(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Falha ao excluir role');
      setDeletingRoleId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        Carregando gestão de usuários e roles...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── USUÁRIOS ───────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Gerencie usuários e associe roles com segurança.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Formulário novo usuário */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-sm font-bold text-secondary">Novo usuário</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input placeholder="Nome" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
              <Input placeholder="Email" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
              <Input placeholder="Senha" type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger><SelectValue placeholder="Selecionar role" /></SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={createUser} disabled={creatingUser} size="sm" className="bg-primary text-secondary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-1" />
              {creatingUser ? 'Criando...' : 'Criar usuário'}
            </Button>
          </div>

          {/* Lista usuários */}
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 border-b border-border">
                  <th className="text-left p-3 font-bold text-secondary">Nome</th>
                  <th className="text-left p-3 font-bold text-secondary">Email</th>
                  <th className="text-left p-3 font-bold text-secondary">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.id} className={`border-t border-border ${i % 2 === 0 ? 'bg-white' : 'bg-muted/20'}`}>
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 text-muted-foreground">{user.email}</td>
                    <td className="p-3">
                      <Select
                        value={user.role_id || ''}
                        onValueChange={(value) => updateUserRole(user.id, value)}
                        disabled={user.role_name === 'super_admin'}
                      >
                        <SelectTrigger className="w-[200px] h-8 text-xs">
                          <SelectValue placeholder="Sem role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={3} className="p-6 text-center text-muted-foreground text-sm">Nenhum usuário cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── ROLES ──────────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Roles e Permissões</CardTitle>
            <CardDescription>Edite perfis de acesso com granularidade por recurso e ação.</CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNewRoleForm((v) => !v)}
            className="flex-shrink-0"
          >
            {showNewRoleForm ? <><X className="w-3.5 h-3.5 mr-1" />Cancelar</> : <><Plus className="w-3.5 h-3.5 mr-1" />Novo role</>}
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Formulário novo role */}
          {showNewRoleForm && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-4">
              <p className="text-sm font-bold text-secondary">Novo role</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Nome do role <span className="text-destructive">*</span></Label>
                  <Input placeholder="ex: content_manager" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Descrição</Label>
                  <Input placeholder="Descrição do role" value={newRoleDescription} onChange={(e) => setNewRoleDescription(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold">Permissões</Label>
                <PermissionGrid permissions={permissions} selected={newRolePermissions} onToggle={toggleNewPerm} />
              </div>
              <Button onClick={createRole} disabled={creatingRole} size="sm" className="bg-primary text-secondary hover:bg-primary/90">
                <Check className="w-4 h-4 mr-1" />
                {creatingRole ? 'Criando...' : 'Salvar role'}
              </Button>
            </div>
          )}

          {/* Lista de roles */}
          <div className="space-y-3">
            {roles.map((role) => {
              const isEditing = editingRole?.id === role.id;
              const isDeleting = deletingRoleId === role.id;
              const isSuperAdmin = role.name === 'super_admin';

              return (
                <div key={role.id} className={`rounded-xl border ${isEditing ? 'border-primary/50 bg-primary/5' : 'border-border bg-white'} overflow-hidden transition-all`}>

                  {/* Cabeçalho do role */}
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="space-y-1">
                            <Label className="text-xs font-bold">Nome <span className="text-destructive">*</span></Label>
                            <Input
                              value={editRoleName}
                              onChange={(e) => setEditRoleName(e.target.value)}
                              disabled={isSuperAdmin}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-bold">Descrição</Label>
                            <Input
                              value={editRoleDescription}
                              onChange={(e) => setEditRoleDescription(e.target.value)}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="font-bold text-secondary">{role.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{role.description || 'Sem descrição'}</p>
                        </>
                      )}
                    </div>

                    {/* Ações */}
                    {!isSuperAdmin && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isEditing ? (
                          <>
                            <Button size="sm" onClick={saveEditRole} disabled={savingRole} className="h-8 bg-primary text-secondary hover:bg-primary/90">
                              <Check className="w-3.5 h-3.5 mr-1" />
                              {savingRole ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditRole} className="h-8">
                              <X className="w-3.5 h-3.5 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        ) : isDeleting ? (
                          <>
                            <span className="text-xs text-destructive font-medium">Confirmar exclusão?</span>
                            <Button size="sm" variant="destructive" onClick={() => deleteRole(role.id)} className="h-7 text-xs px-2">
                              <Trash2 className="w-3 h-3 mr-1" /> Excluir
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setDeletingRoleId(null)} className="h-7 text-xs px-2">
                              Não
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => startEditRole(role)} className="h-8">
                              <Pencil className="w-3.5 h-3.5 mr-1" />
                              Editar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setDeletingRoleId(role.id)} className="h-8 text-destructive hover:bg-destructive hover:text-white border-destructive/30">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                    {isSuperAdmin && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Protegido</span>
                    )}
                  </div>

                  {/* Permissões */}
                  <div className="border-t border-border px-4 py-3">
                    {isEditing ? (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-secondary">Permissões</p>
                        <PermissionGrid permissions={permissions} selected={editRolePermissions} onToggle={toggleEditPerm} />
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {(role.permissions || []).length === 0 ? (
                          <span className="text-xs text-muted-foreground">Nenhuma permissão atribuída</span>
                        ) : (
                          (role.permissions || []).map((p) => (
                            <span key={`${role.id}-${p.id}`} className="text-xs rounded-full bg-muted px-2.5 py-1 text-muted-foreground font-medium">
                              {p.resource}:{p.action}
                            </span>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersRolesTab;
