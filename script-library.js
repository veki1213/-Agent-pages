(() => {
  'use strict';

  const root = document.querySelector('[data-testid="script-library-view"]');
  if (!root) return;

  const icons = {
    folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h7l2 2h9v10H3z"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4 4"/></svg>',
    list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></svg>',
  };

  const state = {
    scope: 'public',
    directory: 'all',
    filter: 'all',
    search: '',
    sort: 'updated',
    view: 'list',
    selected: new Set(),
    selectedId: null,
    menuId: null,
    actionMode: null,
    actionId: null,
    pendingUploadId: null,
    scripts: [
      { id: 'public-example', scope: 'public', directory: 'brand', name: '客户资料清洗.py', kind: 'Python', version: 'v1.4', source: '本地上传', owner: '林知远', updated: '今天 09:20', timestamp: 200, trashed: false },
      { id: 'private-example', scope: 'private', directory: 'private', name: '个人草稿检查.sql', kind: 'SQL', version: 'v1.0', source: '本地上传', owner: '许舒', updated: '今天 08:50', timestamp: 100, trashed: false },
    ],
    directories: [
      { id: 'brand', name: '品牌增长 2026' },
      { id: 'patient', name: '患者教育内容升级' },
    ],
    privateDirectories: [{ id: 'private', name: '我的私人脚本库' }],
  };

  let mounted = false;
  let nextId = 1;

  function directoryName(id) {
    return [...state.directories, ...state.privateDirectories].find((item) => item.id === id)?.name || '项目公共脚本库';
  }

  function notify(message) {
    document.dispatchEvent(new CustomEvent('script-library:notify', { detail: { message } }));
  }

  function scriptKind(name) {
    const extension = name.split('.').pop()?.toLocaleLowerCase();
    return { py: 'Python', sql: 'SQL', js: 'JavaScript', ts: 'TypeScript', sh: 'Shell', r: 'R' }[extension] || '脚本';
  }

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function visibleScripts() {
    const term = state.search.trim().toLocaleLowerCase();
    return state.scripts.filter((item) => {
      if (item.scope !== state.scope) return false;
      if (state.directory !== 'all' && item.directory !== state.directory) return false;
      if (item.trashed !== (state.filter === 'trash')) return false;
      if (!term) return true;
      return [item.name, directoryName(item.directory), item.owner].some((part) => part.toLocaleLowerCase().includes(term));
    }).sort((a, b) => {
      if (state.sort === 'name') return a.name.localeCompare(b.name, 'zh-Hans-CN');
      if (state.sort === 'owner') return a.owner.localeCompare(b.owner, 'zh-Hans-CN');
      return b.timestamp - a.timestamp;
    });
  }

  function renderProjectFilter() {
    const select = root.querySelector('[data-testid="script-project-filter"]');
    const directories = state.scope === 'private' ? state.privateDirectories : state.directories;
    select.replaceChildren(
      new Option('全部项目', 'all'),
      ...directories.map((item) => new Option(item.name, item.id)),
    );
    select.value = state.directory;
  }

  function renderRow(item) {
    const row = make('article', 'script-row');
    row.dataset.testid = 'script-row';
    row.dataset.scriptId = item.id;
    if (state.selectedId === item.id) {
      row.classList.add('active');
      row.setAttribute('aria-current', 'true');
    }

    const checkbox = make('input', 'script-select');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('aria-label', `选择 ${item.name}`);
    checkbox.dataset.scriptSelect = item.id;
    checkbox.checked = state.selected.has(item.id);
    row.append(checkbox);

    const name = make('button', 'script-file');
    name.type = 'button';
    name.dataset.scriptDetail = item.id;
    name.append(make('strong', '', item.name), make('small', '', `${item.kind} · ${item.version}`));
    row.append(name);
    row.append(make('span', 'script-directory-cell', directoryName(item.directory)));
    row.append(make('span', 'script-source-cell', item.source));
    row.append(make('span', 'script-owner-cell', item.owner));
    row.append(make('span', 'script-updated-cell', item.updated));

    const actions = make('div', 'script-row-actions');
    const more = make('button', 'script-row-more', '···');
    more.type = 'button';
    more.dataset.scriptMenu = item.id;
    more.setAttribute('aria-label', `${item.name} 的更多操作`);
    more.setAttribute('aria-expanded', String(state.menuId === item.id));
    actions.append(more);
    if (!item.trashed) {
      const jump = make('button', 'script-row-import', '›');
      jump.type = 'button';
      jump.dataset.scriptImport = item.id;
      jump.setAttribute('aria-label', `导入 ${item.name} 到对话`);
      actions.append(jump);
    }
    if (state.menuId === item.id) {
      const menu = make('div', 'script-row-popover');
      menu.setAttribute('role', 'menu');
      const addAction = (label, action) => {
        const button = make('button', '', label);
        button.type = 'button';
        button.dataset.scriptAction = action;
        button.dataset.scriptActionId = item.id;
        button.setAttribute('role', 'menuitem');
        menu.append(button);
      };
      if (item.trashed) {
        addAction('恢复脚本', 'restore');
      } else {
        addAction('下载', 'download');
        addAction('上传新版本', 'upload-version');
        addAction('重命名', 'rename');
        if (item.scope === 'public') addAction('备份到个人空间', 'backup');
        else {
          addAction('分享到项目空间', 'share');
          addAction('移动到文件夹', 'move');
          addAction('移入回收站', 'trash');
        }
      }
      actions.append(menu);
    }
    row.append(actions);
    return row;
  }

  function render() {
    if (!mounted) return;
    const publicScope = root.querySelector('[data-testid="script-scope-public"]');
    const privateScope = root.querySelector('[data-testid="script-scope-private"]');
    publicScope.classList.toggle('active', state.scope === 'public');
    privateScope.classList.toggle('active', state.scope === 'private');
    publicScope.setAttribute('aria-pressed', String(state.scope === 'public'));
    privateScope.setAttribute('aria-pressed', String(state.scope === 'private'));
    publicScope.setAttribute('aria-selected', String(state.scope === 'public'));
    privateScope.setAttribute('aria-selected', String(state.scope === 'private'));
    publicScope.tabIndex = state.scope === 'public' ? 0 : -1;
    privateScope.tabIndex = state.scope === 'private' ? 0 : -1;
    root.querySelector('[data-script-scope-title]').textContent = state.scope === 'private'
      ? '我的私人脚本库' : '项目公共脚本库';
    root.querySelector('[data-script-scope-description]').textContent = state.scope === 'private'
      ? '仅自己可见，集中整理和查找个人脚本；脚本不会在平台内执行。'
      : '集中浏览和查找项目可复用脚本；脚本不会在平台内执行。';
    root.querySelector('.script-project-create').hidden = state.scope !== 'public';
    renderProjectFilter();
    const tabs = root.querySelector('.script-filter-tabs');
    tabs.hidden = state.scope !== 'private';
    const listing = root.querySelector('.script-listing');
    if (state.scope === 'private') listing.setAttribute('aria-labelledby', `script-scope-tab-private script-filter-tab-${state.filter}`);
    else listing.setAttribute('aria-labelledby', 'script-scope-tab-public');
    const allTab = root.querySelector('[data-testid="script-filter-all"]');
    const trashTab = root.querySelector('[data-testid="script-recycle-bin"]');
    allTab.setAttribute('aria-selected', String(state.filter === 'all'));
    trashTab.setAttribute('aria-selected', String(state.filter === 'trash'));
    allTab.tabIndex = state.filter === 'all' ? 0 : -1;
    trashTab.tabIndex = state.filter === 'trash' ? 0 : -1;
    allTab.classList.toggle('active', state.filter === 'all');
    trashTab.classList.toggle('active', state.filter === 'trash');
    root.querySelector('[data-testid="script-sort"]').value = state.sort;
    root.querySelector('[data-testid="script-list-view"]').setAttribute('aria-pressed', String(state.view === 'list'));
    root.querySelector('[data-testid="script-grid-view"]').setAttribute('aria-pressed', String(state.view === 'grid'));
    root.querySelector('.script-listing').classList.toggle('is-grid-view', state.view === 'grid');

    const scripts = visibleScripts();
    const body = root.querySelector('.script-table-body');
    body.replaceChildren(...scripts.map(renderRow));
    positionMenu();
    root.querySelector('.script-table-head').hidden = state.view === 'grid';
    root.querySelector('[data-testid="script-empty"]').hidden = scripts.length > 0;
    root.querySelector('[data-script-count]').textContent = String(scripts.length);
    root.querySelector('[data-script-footer-unit]').textContent = state.filter === 'trash' ? '个回收站脚本' : '个脚本';
    const selectAll = root.querySelector('[data-script-select-all]');
    selectAll.checked = Boolean(scripts.length) && scripts.every((item) => state.selected.has(item.id));
    selectAll.indeterminate = scripts.some((item) => state.selected.has(item.id)) && !selectAll.checked;
    const selectedLive = scripts.filter((item) => !item.trashed && state.selected.has(item.id));
    const importSelected = root.querySelector('[data-testid="script-import-selected"]');
    importSelected.hidden = selectedLive.length === 0;
    importSelected.setAttribute('aria-label', selectedLive.length ? `导入 ${selectedLive.length} 个选中脚本到对话` : '导入选中脚本到对话');
  }

  function positionMenu() {
    const menu = root.querySelector('.script-row-popover');
    if (!menu) return;
    const trigger = menu.parentElement.querySelector('[data-script-menu]');
    const triggerRect = trigger.getBoundingClientRect();
    const width = menu.offsetWidth;
    const height = menu.offsetHeight;
    const below = triggerRect.bottom + 4;
    const top = below + height + 8 <= window.innerHeight
      ? below : Math.max(8, triggerRect.top - height - 4);
    menu.style.left = `${Math.max(8, Math.min(triggerRect.right - width, window.innerWidth - width - 8))}px`;
    menu.style.top = `${top}px`;
  }

  function openCreate() {
    state.menuId = null;
    render();
    const backdrop = root.querySelector('[data-testid="script-create-dialog"]');
    backdrop.hidden = false;
    const form = backdrop.querySelector('form');
    form.reset();
    const location = root.querySelector('[data-script-create-location]');
    location.textContent = directoryName(state.scope === 'private'
      ? 'private' : (state.directory === 'all' ? state.directories[0].id : state.directory));
    backdrop.querySelector('[data-testid="script-name-input"]').focus();
  }

  function closeCreate() {
    root.querySelector('[data-testid="script-create-dialog"]').hidden = true;
    root.querySelector('[data-testid="script-add"]').focus();
  }

  function createScript(form) {
    const input = form.querySelector('[data-testid="script-name-input"]');
    const file = form.querySelector('[data-script-file]').files[0];
    const name = input.value.trim() || file?.name || '';
    if (!name) {
      input.setCustomValidity('请输入脚本名称');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    state.scripts.push({
      id: `user-script-${nextId++}`,
      scope: state.scope,
      directory: state.scope === 'private' ? 'private' : (state.directory === 'all' ? state.directories[0].id : state.directory),
      name,
      kind: scriptKind(name),
      version: 'v1.0',
      source: file ? '本地上传' : '手动添加',
      owner: '我',
      updated: '刚刚',
      timestamp: Date.now(),
      trashed: false,
      file: file || null,
    });
    state.filter = 'all';
    state.search = '';
    root.querySelector('[data-testid="script-search"]').value = '';
    closeCreate();
    render();
  }

  function openDetail(id) {
    const item = state.scripts.find((script) => script.id === id);
    if (!item) return;
    state.selectedId = id;
    state.detailReturnId = id;
    state.menuId = null;
    render();
    const dialog = root.querySelector('[data-testid="script-detail-dialog"]');
    dialog.querySelector('[data-script-detail-title]').textContent = item.name;
    dialog.querySelector('[data-script-detail-kind]').textContent = `${item.kind} · ${item.version}`;
    dialog.querySelector('[data-script-detail-directory]').textContent = directoryName(item.directory);
    dialog.querySelector('[data-script-detail-owner]').textContent = item.owner;
    dialog.hidden = false;
    dialog.querySelector('button').focus();
  }

  function closeDetail() {
    root.querySelector('[data-testid="script-detail-dialog"]').hidden = true;
    const row = [...root.querySelectorAll('[data-script-id]')].find((item) => item.dataset.scriptId === state.detailReturnId);
    (row?.querySelector('[data-script-detail]') || root.querySelector('[data-testid="script-add"]'))?.focus();
    state.detailReturnId = null;
  }

  function toggleTrash(id) {
    const item = state.scripts.find((script) => script.id === id);
    if (!item || item.scope !== 'private') return;
    item.trashed = !item.trashed;
    item.updated = '刚刚';
    item.timestamp = Date.now();
    state.menuId = null;
    state.selected.delete(id);
    render();
    root.querySelector(`[data-script-filter="${state.filter}"]`)?.focus();
  }

  function importScripts(items) {
    const live = items.filter((item) => item && !item.trashed && item.scope === state.scope);
    if (!live.length) return notify('请先选择脚本');
    const scripts = live.map(({ id, name, scope, directory }) => ({ id, name, scope, directory }));
    state.selected.clear();
    state.menuId = null;
    render();
    document.dispatchEvent(new CustomEvent('script-library:import', { detail: { scripts } }));
  }

  function openActionDialog(mode, id) {
    const item = state.scripts.find((script) => script.id === id);
    if (!item) return;
    state.actionMode = mode;
    state.actionId = id;
    state.menuId = null;
    render();
    const dialog = root.querySelector('[data-testid="script-action-dialog"]');
    const rename = dialog.querySelector('[data-script-rename-field]');
    const move = dialog.querySelector('[data-script-move-field]');
    const share = dialog.querySelector('[data-script-share-field]');
    rename.hidden = mode !== 'rename';
    move.hidden = mode !== 'move';
    share.hidden = mode !== 'share';
    dialog.querySelector('[data-script-action-title]').textContent = { rename: '重命名脚本', move: '移动到文件夹', share: '分享到项目空间' }[mode];
    dialog.querySelector('[data-script-action-submit]').textContent = { rename: '保存', move: '移动', share: '分享' }[mode];
    const input = dialog.querySelector(mode === 'rename' ? '[data-script-rename-input]' : mode === 'move' ? '[data-script-move-input]' : '[data-script-share-target]');
    if (mode === 'share') {
      input.replaceChildren(new Option('请选择目标项目', ''), ...state.directories.map((entry) => new Option(entry.name, entry.id)));
      input.value = '';
    } else input.value = mode === 'rename' ? item.name : '';
    input.setCustomValidity('');
    dialog.hidden = false;
    input.focus();
    if (mode === 'rename') input.select();
  }

  function closeActionDialog(restoreFocus = true) {
    root.querySelector('[data-testid="script-action-dialog"]').hidden = true;
    const id = state.actionId;
    state.actionMode = null;
    state.actionId = null;
    if (restoreFocus) [...root.querySelectorAll('[data-script-menu]')].find((button) => button.dataset.scriptMenu === id)?.focus();
  }

  function submitActionDialog() {
    const item = state.scripts.find((script) => script.id === state.actionId);
    if (!item) return closeActionDialog(false);
    const dialog = root.querySelector('[data-testid="script-action-dialog"]');
    const input = dialog.querySelector(state.actionMode === 'rename' ? '[data-script-rename-input]' : state.actionMode === 'move' ? '[data-script-move-input]' : '[data-script-share-target]');
    const value = input.value.trim();
    if (!value) {
      input.setCustomValidity({ rename: '请输入脚本名称', move: '请输入目标文件夹', share: '请选择目标项目' }[state.actionMode]);
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    if (state.actionMode === 'rename') {
      item.name = value;
      item.kind = scriptKind(value);
      notify('脚本已重命名');
    } else if (state.actionMode === 'move') {
      let directory = state.privateDirectories.find((entry) => entry.name === value);
      if (!directory) {
        directory = { id: `private-directory-${nextId++}`, name: value };
        state.privateDirectories.push(directory);
      }
      item.directory = directory.id;
      state.directory = directory.id;
      notify('脚本已移动到文件夹');
    } else if (state.actionMode === 'share') {
      if (!state.directories.some((directory) => directory.id === value)) return notify('请选择有效的目标项目');
      copyScript(item, 'public', value);
      render();
      closeActionDialog();
      return;
    }
    item.updated = '刚刚';
    item.timestamp = Date.now();
    render();
    closeActionDialog();
  }

  function downloadScript(item) {
    if (!(item.file instanceof File)) return notify('当前脚本没有可下载的原始文件');
    const url = URL.createObjectURL(item.file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = item.name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    notify('脚本下载已开始');
  }

  function copyScript(item, scope, targetDirectory) {
    const directory = scope === 'private' ? 'private' : targetDirectory;
    state.scripts.push({
      ...item,
      id: `user-script-${nextId++}`,
      scope,
      directory,
      source: scope === 'private' ? '项目空间备份' : '个人空间分享',
      owner: '我',
      updated: '刚刚',
      timestamp: Date.now(),
      trashed: false,
    });
    notify(scope === 'private' ? '已备份到个人空间' : '已分享到项目空间');
  }

  function runMenuAction(action, id) {
    const item = state.scripts.find((script) => script.id === id);
    if (!item) return;
    state.menuId = null;
    if (action === 'rename' || action === 'move' || action === 'share') return openActionDialog(action, id);
    if (action === 'upload-version') {
      state.pendingUploadId = id;
      render();
      const input = root.querySelector('[data-script-version-file]');
      input.value = '';
      input.click();
      return;
    }
    if (action === 'download') downloadScript(item);
    else if (action === 'backup') copyScript(item, 'private');
    else if (action === 'trash' || action === 'restore') return toggleTrash(id);
    render();
    [...root.querySelectorAll('[data-script-menu]')].find((button) => button.dataset.scriptMenu === id)?.focus();
  }

  function uploadVersion(file) {
    const item = state.scripts.find((script) => script.id === state.pendingUploadId);
    state.pendingUploadId = null;
    if (!item || !file) return;
    const currentExtension = item.name.split('.').pop()?.toLocaleLowerCase();
    const uploadedExtension = file.name.split('.').pop()?.toLocaleLowerCase();
    if (currentExtension !== uploadedExtension) return notify('新版本文件格式需与当前脚本一致');
    item.file = file;
    const version = /^v(\d+)\.(\d+)$/.exec(item.version);
    item.version = version ? `v${version[1]}.${Number(version[2]) + 1}` : 'v1.1';
    item.updated = '刚刚';
    item.timestamp = Date.now();
    render();
    notify('脚本新版本已上传');
  }

  function onClick(event) {
    const row = event.target.closest('[data-script-id]');
    if (row && root.contains(row) && !event.target.closest('input,button,[role="menu"]')) {
      openDetail(row.dataset.scriptId);
      return;
    }
    const target = event.target.closest('button');
    if (!target || !root.contains(target)) {
      if (event.target === root.querySelector('[data-testid="script-create-dialog"]')) closeCreate();
      if (event.target === root.querySelector('[data-testid="script-detail-dialog"]')) closeDetail();
      if (event.target === root.querySelector('[data-testid="script-action-dialog"]')) closeActionDialog();
      return;
    }
    if (target.dataset.scriptScope) {
      state.scope = target.dataset.scriptScope;
      state.directory = 'all';
      state.filter = 'all';
      state.search = '';
      state.menuId = null;
      root.querySelector('[data-testid="script-search"]').value = '';
      root.querySelector('[data-script-new-directory]').hidden = true;
      root.querySelector('[data-script-add-directory]').setAttribute('aria-expanded', 'false');
      render();
    } else if (target.dataset.scriptFilter) {
      state.filter = target.dataset.scriptFilter;
      state.menuId = null;
      render();
    } else if (target.dataset.scriptView) {
      state.view = target.dataset.scriptView;
      render();
    } else if (target.hasAttribute('data-script-open-create')) {
      openCreate();
    } else if (target.hasAttribute('data-script-close-create')) {
      closeCreate();
    } else if (target.dataset.scriptMenu) {
      const id = target.dataset.scriptMenu;
      state.menuId = state.menuId === id ? null : id;
      render();
      const row = [...root.querySelectorAll('[data-script-id]')].find((item) => item.dataset.scriptId === id);
      (state.menuId ? row?.querySelector('[role="menuitem"]') : row?.querySelector('[data-script-menu]'))?.focus();
    } else if (target.dataset.scriptImport) {
      importScripts(visibleScripts().filter((item) => item.id === target.dataset.scriptImport));
    } else if (target.hasAttribute('data-script-import-selected')) {
      importScripts(visibleScripts().filter((item) => state.selected.has(item.id)));
    } else if (target.dataset.scriptAction) {
      runMenuAction(target.dataset.scriptAction, target.dataset.scriptActionId);
    } else if (target.dataset.scriptTrash) {
      toggleTrash(target.dataset.scriptTrash);
    } else if (target.dataset.scriptDetail) {
      openDetail(target.dataset.scriptDetail);
    } else if (target.hasAttribute('data-script-close-detail')) {
      closeDetail();
    } else if (target.hasAttribute('data-script-close-action')) {
      closeActionDialog();
    } else if (target.hasAttribute('data-script-add-directory')) {
      const field = root.querySelector('[data-script-new-directory]');
      field.hidden = !field.hidden;
      target.setAttribute('aria-expanded', String(!field.hidden));
      if (!field.hidden) field.focus();
    } else if (state.menuId) {
      state.menuId = null;
      render();
    }
  }

  function onInput(event) {
    if (event.target.matches('[data-testid="script-search"]')) {
      state.search = event.target.value;
      render();
    } else if (event.target.matches('[data-testid="script-name-input"]')) {
      event.target.setCustomValidity('');
    } else if (event.target.matches('[data-script-rename-input],[data-script-move-input]')) {
      event.target.setCustomValidity('');
    }
  }

  function onChange(event) {
    if (event.target.matches('[data-testid="script-sort"]')) {
      state.sort = event.target.value;
      render();
    } else if (event.target.matches('[data-testid="script-project-filter"]')) {
      state.directory = event.target.value;
      state.menuId = null;
      render();
    } else if (event.target.matches('[data-script-file]')) {
      const file = event.target.files[0];
      const input = root.querySelector('[data-testid="script-name-input"]');
      if (file && !input.value.trim()) input.value = file.name;
    } else if (event.target.matches('[data-script-version-file]')) {
      uploadVersion(event.target.files[0]);
    } else if (event.target.matches('[data-script-share-target]')) {
      event.target.setCustomValidity('');
    } else if (event.target.matches('[data-script-select-all]')) {
      visibleScripts().forEach((item) => event.target.checked ? state.selected.add(item.id) : state.selected.delete(item.id));
      render();
    } else if (event.target.matches('[data-script-select]')) {
      const id = event.target.dataset.scriptSelect;
      event.target.checked ? state.selected.add(id) : state.selected.delete(id);
      render();
      [...root.querySelectorAll('[data-script-select]')].find((item) => item.dataset.scriptSelect === id)?.focus();
    }
  }

  function onKeydown(event) {
    const detailDialog = root.querySelector('[data-testid="script-detail-dialog"]');
    if (event.key === 'Tab' && !detailDialog.hidden) {
      const buttons = [...detailDialog.querySelectorAll('button')];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    const actionDialog = root.querySelector('[data-testid="script-action-dialog"]');
    if (event.key === 'Tab' && !actionDialog.hidden) {
      const controls = [...actionDialog.querySelectorAll('button,input,select')].filter((control) => control.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    const menu = event.target.closest('.script-row-popover');
    if (menu && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const items = [...menu.querySelectorAll('[role="menuitem"]')];
      const index = items.indexOf(event.target);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
        : event.key === 'ArrowDown' ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
      items[next]?.focus();
      return;
    }
    if (event.target.matches('[data-script-scope]') && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      const next = root.querySelector(`[data-script-scope="${state.scope === 'public' ? 'private' : 'public'}"]`);
      next.click();
      next.focus();
      return;
    }
    if (event.target.matches('[data-script-filter]') && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      state.filter = state.filter === 'all' ? 'trash' : 'all';
      state.menuId = null;
      render();
      root.querySelector(`[data-script-filter="${state.filter}"]`)?.focus();
      return;
    }
    if (event.key === 'Escape') {
      const newDirectory = root.querySelector('[data-script-new-directory]');
      if (event.target === newDirectory && !newDirectory.hidden) {
        newDirectory.hidden = true;
        const createProject = root.querySelector('[data-script-add-directory]');
        createProject.setAttribute('aria-expanded', 'false');
        createProject.focus();
        return;
      }
      const menuId = state.menuId;
      if (!root.querySelector('[data-testid="script-create-dialog"]').hidden) {
        closeCreate();
        return;
      }
      if (!root.querySelector('[data-testid="script-detail-dialog"]').hidden) {
        closeDetail();
        return;
      }
      if (!root.querySelector('[data-testid="script-action-dialog"]').hidden) {
        closeActionDialog();
        return;
      }
      if (!menuId) return;
      state.menuId = null;
      render();
      if (menuId) [...root.querySelectorAll('[data-script-menu]')].find((item) => item.dataset.scriptMenu === menuId)?.focus();
    }
    if (event.key === 'Enter' && event.target.matches('[data-script-new-directory]')) {
      event.preventDefault();
      const name = event.target.value.trim();
      if (!name) return;
      const id = `new-directory-${nextId++}`;
      state.directories.push({ id, name });
      state.directory = id;
      event.target.value = '';
      event.target.hidden = true;
      root.querySelector('[data-script-add-directory]').setAttribute('aria-expanded', 'false');
      render();
      root.querySelector('[data-testid="script-project-filter"]').focus();
    }
  }

  function mount() {
    if (mounted) {
      root.querySelector('[data-testid="script-detail-dialog"]').hidden = true;
      root.querySelector('[data-testid="script-action-dialog"]').hidden = true;
      state.detailReturnId = null;
      state.actionMode = null;
      state.actionId = null;
      state.menuId = null;
      render();
      return;
    }
    root.innerHTML = `
      <div class="script-shell">
        <main class="script-main">
          <div class="script-scope-tabs" data-testid="script-scope-tabs" role="tablist" aria-label="脚本库空间">
            <button class="script-scope active" id="script-scope-tab-public" type="button" role="tab" data-script-scope="public" data-testid="script-scope-public" aria-controls="script-listing" aria-selected="true" aria-pressed="true" tabindex="0">项目空间</button>
            <button class="script-scope" id="script-scope-tab-private" type="button" role="tab" data-script-scope="private" data-testid="script-scope-private" aria-controls="script-listing" aria-selected="false" aria-pressed="false" tabindex="-1">个人空间</button>
          </div>
          <header class="script-header function-page-header">
            <div class="script-heading-copy"><h1 data-script-scope-title>项目公共脚本库</h1><p class="script-description" data-script-scope-description data-function-page-description>集中浏览和查找项目可复用脚本；脚本不会在平台内执行。</p></div>
            <div class="script-header-actions">
              <div class="script-project-create"><button type="button" data-script-add-directory aria-expanded="false"><span aria-hidden="true">＋</span>新建项目</button><input type="text" data-script-new-directory aria-label="新项目名称" placeholder="输入项目名称并按回车" maxlength="30" hidden></div>
              <button class="script-add" type="button" data-script-open-create data-testid="script-add"><span aria-hidden="true">＋</span>添加脚本</button>
            </div>
          </header>
          <div class="script-filter-tabs" role="tablist" aria-label="脚本状态" hidden><button class="active" id="script-filter-tab-all" type="button" role="tab" data-script-filter="all" data-testid="script-filter-all" aria-controls="script-listing" aria-selected="true">全部脚本</button><button id="script-filter-tab-trash" type="button" role="tab" data-script-filter="trash" data-testid="script-recycle-bin" aria-controls="script-listing" aria-selected="false">${icons.folder} 回收站</button></div>
          <div class="script-toolbar">
            <label class="script-search">${icons.search}<input type="search" data-testid="script-search" aria-label="搜索脚本" placeholder="搜索脚本名称、所在目录或所有者"></label>
            <label class="script-project-filter"><span>项目</span><select data-testid="script-project-filter" aria-label="筛选项目"><option value="all">全部项目</option></select></label>
            <label class="script-sort"><span>排序</span><select data-testid="script-sort" aria-label="脚本排序"><option value="updated">更新时间</option><option value="name">名称</option><option value="owner">所有者</option></select></label>
            <div class="script-view-switch" role="group" aria-label="脚本显示方式"><button type="button" data-script-view="list" data-testid="script-list-view" aria-label="列表视图" aria-pressed="true">${icons.list}</button><button type="button" data-script-view="grid" data-testid="script-grid-view" aria-label="网格视图" aria-pressed="false">${icons.grid}</button></div>
            <button class="script-import-selected" type="button" data-script-import-selected data-testid="script-import-selected" hidden>导入对话</button>
          </div>
          <section class="script-listing" id="script-listing" role="tabpanel" tabindex="0" aria-label="脚本列表"><div class="script-table-head"><input type="checkbox" data-script-select-all aria-label="选择全部脚本"><span>名称</span><span>所在目录</span><span>来源</span><span>所有者</span><span>更新时间</span><span></span></div><div class="script-table-body"></div><p class="script-empty" data-testid="script-empty" hidden>没有找到脚本</p></section>
          <footer class="script-footer"><span>共 <strong data-script-count>0</strong> <span data-script-footer-unit>个脚本</span></span><span>脚本只读浏览 · 不提供运行、调试或依赖安装</span></footer>
        </main>
      </div>
      <div class="script-dialog-backdrop" data-testid="script-create-dialog" hidden><section class="script-dialog" role="dialog" aria-modal="true" aria-labelledby="script-create-title"><header><div><h2 id="script-create-title">添加脚本</h2><p>添加到 <strong data-script-create-location></strong></p></div><button type="button" data-script-close-create aria-label="关闭添加脚本弹窗">×</button></header><form data-script-create-form><label>脚本名称<input type="text" data-testid="script-name-input" placeholder="例如：数据清洗.py" maxlength="120" required></label><label>选择本地文件（可选）<input type="file" data-script-file accept=".py,.sql,.js,.ts,.sh,.r,.ipynb,.txt"></label><p>脚本仅供集中查找和浏览，不会在平台内执行。</p><footer><button type="button" data-script-close-create>取消</button><button type="submit" data-testid="script-create-submit">添加脚本</button></footer></form></section></div>
      <div class="script-dialog-backdrop" data-testid="script-detail-dialog" hidden><section class="script-dialog" role="dialog" aria-modal="true" aria-labelledby="script-detail-title"><header><div><h2 id="script-detail-title" data-script-detail-title></h2><p data-script-detail-kind></p></div><button type="button" data-script-close-detail aria-label="关闭脚本详情">×</button></header><dl class="script-detail-list"><div><dt>所在目录</dt><dd data-script-detail-directory></dd></div><div><dt>所有者</dt><dd data-script-detail-owner></dd></div></dl><p class="script-detail-note">脚本只读浏览，不提供运行、调试或依赖安装。</p><footer><button type="button" data-script-close-detail>关闭</button></footer></section></div>
      <div class="script-dialog-backdrop" data-testid="script-action-dialog" hidden><section class="script-dialog" role="dialog" aria-modal="true" aria-labelledby="script-action-title"><header><h2 id="script-action-title" data-script-action-title></h2><button type="button" data-script-close-action aria-label="关闭脚本操作弹窗">×</button></header><form data-script-action-form><label data-script-rename-field>脚本名称<input type="text" data-script-rename-input maxlength="120"></label><label data-script-move-field>目标文件夹<input type="text" data-script-move-input maxlength="30" placeholder="输入现有或新文件夹名称"></label><label data-script-share-field>目标项目<select data-script-share-target aria-label="目标项目"></select></label><footer><button type="button" data-script-close-action>取消</button><button type="submit" data-script-action-submit>保存</button></footer></form></section></div>
      <input type="file" data-script-version-file accept=".py,.sql,.js,.ts,.sh,.r,.ipynb,.txt" hidden>
    `;
    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('change', onChange);
    root.addEventListener('keydown', onKeydown);
    root.querySelector('[data-script-create-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      createScript(event.currentTarget);
    });
    root.querySelector('[data-script-action-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      submitActionDialog();
    });
    document.addEventListener('click', (event) => {
      if (state.menuId && !event.target.closest('.script-row-actions')) {
        state.menuId = null;
        render();
      }
    });
    root.querySelector('.script-listing').addEventListener('scroll', () => {
      if (state.menuId) {
        state.menuId = null;
        render();
      }
    });
    mounted = true;
    render();
  }

  window.ScriptLibrary = { mount };
})();
