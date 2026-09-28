(() => {
  const mockAccounts = [
    { id: 'veki', name: 'Veki', role: '产品经理，中科闻歌', avatar: '✦' },
    { id: 'mia', name: 'Mia', role: '视觉设计师，中科闻歌', avatar: 'M' },
    { id: 'leo', name: 'Leo', role: '前端工程师，中科闻歌', avatar: 'L' }
  ];

  const creationCategoryLabels = {
    generate: '素材生成',
    acquire: '素材获取',
    video: '视频生成'
  };

  const creationTools = [
    { name: '图像生成', description: '把文字描述转换为完整视觉画面，适合概念探索与快速提案。', prompt: '请根据我的描述生成一张高质量图像', visual: 'primary', category: 'generate' },
    { name: '音频克隆', description: '复刻音色并生成自然语音', prompt: '请帮我克隆并生成指定风格的音频', visual: 'audio', category: 'generate' },
    { name: '数字人生成', description: '根据形象与台词生成数字人内容', prompt: '请帮我生成一段数字人内容', visual: 'digital-human', category: 'generate', available: false },
    { name: '文案提取', description: '从素材中识别并整理文本', prompt: '请从我提供的素材中提取并整理文案', visual: 'copy', category: 'acquire' },
    { name: '素材成片', description: '根据素材自动生成完整视频', prompt: '使用素材成片工具，帮我完成：', visual: 'video', category: 'video' },
    { name: '口播视频剪辑', description: '整理口播内容并完成剪辑', prompt: '使用口播视频剪辑工具，帮我完成：', visual: 'video', category: 'video' },
    { name: 'AI音乐', description: '根据描述生成配乐方案', prompt: '使用AI音乐工具，帮我完成：', visual: 'video', category: 'video' },
    { name: 'AI视频', description: '通过提示词生成视频内容', prompt: '使用AI视频工具，帮我完成：', visual: 'video', category: 'video' },
    { name: '视频拆条', description: '从长视频提取多个短内容', prompt: '使用视频拆条工具，帮我完成：', visual: 'video', category: 'video' },
    { name: '形象库', description: '管理可复用的视频人物形象', prompt: '使用形象库工具，帮我完成：', visual: 'video', category: 'video' }
  ];

  const homeSkillIndustryLabels = {
    education: '教育',
    social: '社交',
    ecommerce: '电商'
  };

  const homeSkills = [
    { name: '品牌视觉助手', title: '品牌视觉', description: '从定位和语气出发，建立可持续复用的视觉方向。', industries: ['ecommerce'] },
    { name: 'UI 动效导演', title: 'UI 动效', description: '规划节奏、转场与关键帧', industries: ['social'] },
    { name: '营销文案策划', title: '营销文案', description: '覆盖社媒、活动与产品发布', industries: ['education', 'social', 'ecommerce'] }
  ];

  const globalSearchGroupLabels = {
    function: '功能',
    project: '项目',
    conversation: '对话',
    asset: '素材',
    knowledge: '资料库',
    skill: 'Skill',
    scheduled: '定时任务'
  };

  const globalSearchGroupOrder = ['function', 'project', 'conversation', 'asset', 'knowledge', 'skill', 'scheduled'];

  const NAME_CHARACTER_LIMIT = 30;
  const nameSegmenter = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

  const state = {
    overlay: null,
    view: 'create',
    mode: 'agent',
    model: 'astra',
    selectedModels: {
      agent: new Set(),
      video: new Set(),
      image: new Set(),
      audio: new Set()
    },
    selectedSkill: null,
    selectedTool: null,
    selectedModules: [],
    homeComposerTextSlot: null,
    homeComposerTextSlots: [''],
    conversationModuleTextSlot: null,
    conversationModuleTextSlots: [''],
    selectedAsset: null,
    selectedConnector: null,
    conversationAsset: null,
    selectedReferences: {
      home: [],
      conversation: []
    },
    selectedAssetSlots: {
      home: 0,
      conversation: 0
    },
    composerSurface: 'home',
    materialTarget: null,
    assetPickerScope: 'personal',
    assetPickerProjectId: 'project-guide',
    assetPickerSelection: new Map(),
    knowledgePickerSpace: 'public',
    knowledgePickerSelection: new Map(),
    toastTimer: null,
    globalSearchQuery: '',
    globalSearchResults: [],
    globalSearchActiveIndex: -1,
    globalSearchHighlightTimer: null,
    submitResetTimer: null,
    activeConversationId: null,
    installedSkills: new Set(),
    capability: 'skills',
    skillCategory: 'all',
    composerSkillCategory: 'all',
    discoveryTab: 'tools',
    creationToolCategory: 'all',
    homeSkillCategory: 'all',
    creationFlyoutCloseTimer: null,
    skillDialogMode: 'import',
    skillImportFile: null,
    skillImportError: '',
    knowledgeSpace: 'public',
    knowledgeFilter: 'all',
    knowledgeRole: 'member',
    knowledgeDirectoryId: 'all',
    knowledgeDirectories: new Map([
      ['knowledge-directory-guide', { id: 'knowledge-directory-guide', space: 'public', name: '项目新手指引' }]
    ]),
    knowledgeSort: 'updated',
    knowledgeView: 'list',
    knowledgeDialogMode: null,
    knowledgeDetailReturnTarget: null,
    knowledgeMenuRow: null,
    knowledgeMenuTrigger: null,
    knowledgeItemAction: null,
    knowledgeItemRow: null,
    knowledgeItemReturnTarget: null,
    knowledgeVersionRow: null,
    knowledgeOnlineImportTimer: null,
    knowledgeDirectorySequence: 0,
    knowledgeDocumentSequence: 6,
    scheduledTasks: [],
    scheduledTaskSequence: 0,
    scheduledTaskEditId: null,
    notificationFilter: 'unread',
    activeAccountId: 'veki',
    notifications: [
      {
        id: 'scheduled-task-created',
        title: '定时任务已创建',
        detail: '“每周品牌复盘”将按计划自动运行。',
        time: '刚刚',
        unread: true
      },
      {
        id: 'knowledge-ready',
        title: '资料库文档解析完成',
        detail: '“Q3 产品路线图”已可用于问答。',
        time: '10 分钟前',
        unread: true
      },
      {
        id: 'project-assets-updated',
        title: '项目素材已更新',
        detail: '项目新手指引新增了 2 个素材。',
        time: '昨天',
        unread: false
      }
    ],
    shareCopyTimer: null,
    libraryTab: 'projects',
    projectScope: 'personal',
    assetScope: 'personal',
    assetProjectId: 'project-guide',
    projectConversationPageId: null,
    selectedProjectId: null,
    projectSequence: 1,
    projectCardSort: 'updated',
    projectCardActivitySequence: 1,
    projectEntrySequence: 0,
    conversationSequence: 0,
    sidebarProjectGroup: 'project',
    sidebarProjectSort: 'manual',
    sidebarProjectOrderSequence: 1,
    sidebarProjectOpenSequence: 0,
    sidebarDraggedProjectId: null,
    sidebarDropProjectId: null,
    sidebarDropAfter: false,
    sidebarDraggedConversationId: null,
    sidebarDraggedConversationProjectId: null,
    sidebarDropConversationTargetProjectId: null,
    draggedComposerModuleId: null,
    composerModuleDropId: null,
    composerModuleDropAfter: false,
    composerModuleDropTextSlot: null,
    sidebarConversationOpenSequence: 0,
    sidebarPinnedOrderSequence: 0,
    submitInProgress: false,
    conversationReplyInProgress: false,
    conversationReplyTimer: null,
    conversationReplyJobs: new Map(),
    projects: new Map([
      ['project-guide', {
        id: 'project-guide',
        type: 'personal',
        name: '项目新手指引',
        pinned: false,
        conversations: [{
          id: 'guide-conversation',
          title: '查看项目使用指南',
          prompt: '查看使用指南->SOP文档跳转，也可以引导用户在当前对话框内进行提问，会调用SOP里的信息进行解答',
          tool: null,
           skill: null,
           createdAt: '2026.8.26',
           status: 'complete',
           unread: false,
           pinned: false,
           order: 0,
           lastOpened: 0,
           followups: [],
           pendingFollowup: null,
           completionTimer: null
         }]
      }]
    ]),
    projectDraftType: 'personal',
    projectRenameTarget: null,
    projectDialogSource: null,
    projectActionTargetId: null,
    projectDeleteTargetId: null
  };

  const submitFeedbackDurationMs = 650;
  const realTaskDurationMs = 5000;

  const modeLabels = {
    agent: 'Agent模型',
    video: '视频生成模型',
    image: '图片生成模型',
    audio: '音频生成模型'
  };

  const modelOptions = {
    agent: [
      { id: 'deepseek', name: 'Deepseek', description: '推理与复杂任务' },
      { id: 'gpt', name: 'Gpt', description: '通用创作与理解' }
    ],
    video: [
      { id: 'seedance', name: 'Seedance', description: '视频生成与镜头表达' },
      { id: 'minimax-video', name: 'Minimax', description: '多风格视频生成' }
    ],
    image: [
      { id: 'seedream-2-5', name: 'Seedream 2.5', description: '高质量图像生成' },
      { id: 'image-2-0', name: 'Image 2.0', description: '通用图像创作' }
    ],
    audio: [
      { id: 'doubao-tts', name: '豆包TTS', description: '自然语音合成' },
      { id: 'mimimax-audio', name: 'Mimimax', description: '多场景音频生成' }
    ]
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function truncateUserVisibleCharacters(value, limit = NAME_CHARACTER_LIMIT) {
    const text = String(value ?? '');
    const segments = nameSegmenter
      ? [...nameSegmenter.segment(text)].map(({ segment }) => segment)
      : Array.from(text);
    return segments.slice(0, limit).join('');
  }

  function enforceNameInputLimit(input) {
    const truncated = truncateUserVisibleCharacters(input.value);
    if (input.value !== truncated) input.value = truncated;
    return truncated;
  }

  const commandMenuState = {
    input: null,
    trigger: null,
    start: -1,
    end: -1,
    items: [],
    activeIndex: -1
  };

  function composerSurfaceFor(element) {
    return element?.closest('[data-testid="conversation-composer"]') ? 'conversation' : 'home';
  }

  function mountComposerPanel(name, surface) {
    const panel = $(`[data-panel="${name}"]`);
    const host = surface === 'conversation'
      ? $('[data-testid="conversation-composer"]')
      : $('.creation-stage');
    if (panel && host && panel.parentElement !== host) host.append(panel);
    if (panel) panel.dataset.composerSurface = surface;
  }

  function syncComposerTriggerState() {
    $$('[data-action="add"],[data-action="model"],[data-action="skill"]').forEach((button) => {
      const expanded = state.overlay === button.dataset.action
        && composerSurfaceFor(button) === state.composerSurface;
      button.setAttribute('aria-expanded', String(expanded));
    });
  }

  function setOverlay(name, trigger = null) {
    const composerOverlay = ['add', 'model', 'skill'].includes(name);
    const nextSurface = composerOverlay ? composerSurfaceFor(trigger) : state.composerSurface;
    const shouldOpen = state.overlay !== name || (composerOverlay && state.composerSurface !== nextSurface);
    closeTransientDropdowns();
    if (!shouldOpen) return;
    if (composerOverlay) {
      state.composerSurface = nextSurface;
      mountComposerPanel(name, nextSurface);
    }
    state.overlay = name;
    if (state.overlay === 'account') renderAccountNotifications();
    if (state.overlay === 'account-login') renderAccountLoginOptions();
    if (state.overlay === 'project-picker') renderProjectPickerOptions();
    else $('[data-project-picker-options]').innerHTML = '';
    $$('[data-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.panel !== state.overlay;
    });
    syncComposerTriggerState();
    $('[data-testid="project-picker-trigger"]').setAttribute('aria-expanded', String(state.overlay === 'project-picker'));
    $('[data-testid="sidebar-project-filter-trigger"]').setAttribute('aria-expanded', String(state.overlay === 'sidebar-project-filter'));
    $('[data-testid="scheduled-task-create"]').setAttribute('aria-expanded', String(state.overlay === 'scheduled-create'));
    $$('[data-action="account"]').forEach((button) => button.setAttribute('aria-expanded', String(state.overlay === 'account')));
    $('[data-testid="account-login-trigger"]')?.setAttribute('aria-expanded', String(state.overlay === 'account-login'));
    if (state.overlay === 'skill') {
      $('[data-testid="composer-skill-search"]').value = '';
      renderComposerSkills();
      selectComposerSkillCategory('all');
    }
  }

  function closeOverlays() {
    state.overlay = null;
    $('[data-project-picker-options]').innerHTML = '';
    $$('[data-panel]').forEach((panel) => { panel.hidden = true; });
    syncComposerTriggerState();
    $('[data-testid="project-picker-trigger"]').setAttribute('aria-expanded', 'false');
    $('[data-testid="sidebar-project-filter-trigger"]').setAttribute('aria-expanded', 'false');
    $('[data-testid="scheduled-task-create"]').setAttribute('aria-expanded', 'false');
    $$('[data-action="account"]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
    $('[data-testid="account-login-trigger"]')?.setAttribute('aria-expanded', 'false');
  }

  function ensureConversationMessageIds(conversation) {
    conversation.messageSequence ||= 0;
    (conversation.followups || []).forEach((entry) => {
      if (!entry.id) entry.id = `${conversation.id}-followup-${++conversation.messageSequence}`;
    });
  }

  function buildGlobalSearchIndex() {
    const entries = [
      { id: 'function-create', type: 'function', title: '开始创作', detail: '功能入口', searchText: '开始创作 功能 新建 对话', target: { view: 'create' } },
      { id: 'function-projects', type: 'function', title: '项目·素材', detail: '项目与项目素材', searchText: '项目 素材 项目素材 我的项目', target: { view: 'projects', libraryTab: 'projects' } },
      { id: 'function-skills', type: 'function', title: '技能', detail: 'Skill 广场', searchText: '技能 Skill Skill广场', target: { view: 'skills', capability: 'skills' } },
      { id: 'function-knowledge', type: 'function', title: '资料库', detail: '项目公共空间与个人空间', searchText: '资料库 知识库 文档 公共空间 个人空间', target: { view: 'knowledge' } },
      { id: 'function-scripts', type: 'function', title: '脚本库', detail: '项目公共脚本库与我的私人脚本库', searchText: '脚本库 脚本 项目 私人', target: { view: 'scripts' } },
      { id: 'function-scheduled', type: 'function', title: '定时任务', detail: '自动运行与稍后安排', searchText: '定时任务 自动运行 稍后安排', target: { view: 'scheduled-tasks' } }
    ];

    creationTools.filter((tool) => tool.available !== false).forEach((tool, index) => {
      entries.push({
        id: `function-tool-${index}`,
        type: 'function',
        title: tool.name,
        detail: tool.description,
        searchText: `${tool.name} ${tool.description} ${creationCategoryLabels[tool.category]}`,
        target: { view: 'create', toolName: tool.name }
      });
    });

    state.projects.forEach((project) => {
      entries.push({
        id: `project-${project.id}`,
        type: 'project',
        title: project.name,
        detail: project.type === 'team' ? '团队项目' : '个人项目',
        searchText: `${project.name} ${project.type === 'team' ? '团队项目' : '个人项目'}`,
        target: { projectId: project.id }
      });

      project.conversations.forEach((conversation) => {
        ensureConversationMessageIds(conversation);
        entries.push({
          id: `conversation-title-${project.id}-${conversation.id}`,
          type: 'conversation',
          title: conversation.title,
          detail: `${project.name} · 对话标题`,
          searchText: `${conversation.title} ${project.name}`,
          target: { projectId: project.id, conversationId: conversation.id, title: true }
        });
        if (conversation.prompt) {
          entries.push({
            id: `conversation-message-${project.id}-${conversation.id}-initial`,
            type: 'conversation',
            title: conversation.title,
            detail: conversation.prompt,
            searchText: `${conversation.prompt} 用户消息`,
            target: { projectId: project.id, conversationId: conversation.id, messageId: `${conversation.id}-initial-user` }
          });
        }
        (conversation.followups || []).forEach((message) => {
          if (!message.text) return;
          entries.push({
            id: `conversation-message-${project.id}-${conversation.id}-${message.id}`,
            type: 'conversation',
            title: conversation.title,
            detail: message.text,
            searchText: `${message.text} ${message.role === 'assistant' ? 'Agent 回复' : '用户消息'}`,
            target: { projectId: project.id, conversationId: conversation.id, messageId: message.id }
          });
        });
      });
    });

    $$('[data-project-file]').forEach((button, index) => {
      const project = state.projects.get(button.dataset.projectId);
      const title = $('strong', button)?.textContent.trim() || button.dataset.previewTitle || '项目内容';
      const detail = $('small', button)?.textContent.trim() || button.dataset.previewCopy || project?.name || '';
      entries.push({
        id: `asset-project-file-${button.dataset.projectId}-${button.dataset.projectFile || index}`,
        type: 'asset',
        title,
        detail: `${project?.name || '项目'} · ${detail}`,
        searchText: `${title} ${detail} ${project?.name || ''}`,
        target: { kind: 'project-file', projectId: button.dataset.projectId, projectFile: button.dataset.projectFile }
      });
    });

    $$('[data-asset-picker-item]').forEach((button, index) => {
      const project = state.projects.get(button.dataset.projectId);
      const name = button.dataset.assetPickerItem;
      entries.push({
        id: `asset-file-${button.dataset.projectId || 'team'}-${index}`,
        type: 'asset',
        title: name,
        detail: `${project?.name || '团队素材'} · ${$('small', button)?.textContent.trim() || '素材'}`,
        searchText: `${name} ${button.textContent} ${project?.name || ''}`,
        target: { kind: 'asset', name, projectId: button.dataset.projectId || '', scope: button.dataset.assetPickerItemScope }
      });
    });

    $$('[data-knowledge-row]').filter((row) => row.dataset.trashed !== 'true').forEach((row, index) => {
      const summary = $('.knowledge-file small', row)?.textContent.trim() || '';
      const directory = $('.knowledge-directory-cell', row)?.textContent.trim() || '';
      entries.push({
        id: `knowledge-${index}-${row.dataset.name}`,
        type: 'knowledge',
        title: row.dataset.name,
        detail: `${directory}${summary ? ` · ${summary}` : ''}`,
        searchText: `${row.dataset.name} ${directory} ${summary} ${row.textContent}`,
        target: {
          name: row.dataset.name,
          space: row.dataset.space || 'public',
          directory: row.dataset.knowledgeDirectoryId || 'all'
        }
      });
    });

    $$('[data-knowledge-space]').forEach((button) => {
      const title = $('span', button)?.textContent.trim() || button.textContent.trim();
      entries.push({
        id: `knowledge-space-${button.dataset.knowledgeSpace}`,
        type: 'knowledge',
        title,
        detail: '资料库空间',
        searchText: `${title} 资料库 知识库 空间`,
        target: { kind: 'space', space: button.dataset.knowledgeSpace }
      });
    });

    $$('[data-knowledge-directory]').forEach((button) => {
      const title = $('span', button)?.textContent.trim() || button.textContent.trim();
      entries.push({
        id: `knowledge-directory-${button.dataset.knowledgeDirectory}`,
        type: 'knowledge',
        title,
        detail: '个人空间目录',
        searchText: `${title} 个人空间 资料库 知识库 目录`,
        target: { kind: 'directory', space: button.dataset.knowledgeSpaceScope || 'private', directory: button.dataset.knowledgeDirectory }
      });
    });

    homeSkills.forEach((skill, index) => {
      const industries = skill.industries.map((industry) => homeSkillIndustryLabels[industry]).join(' ');
      const card = $$('[data-skill-card]').find((candidate) => $('h2', candidate)?.textContent.trim() === skill.name);
      const categories = (card?.dataset.skillCategories || '').split(/\s+/).map((category) => {
        return $(`[data-skill-category="${category}"]`)?.textContent.trim() || category;
      }).join(' ');
      entries.push({
        id: `skill-${index}`,
        type: 'skill',
        title: skill.name,
        detail: skill.description,
        searchText: `${skill.name} ${skill.title} ${skill.description} ${industries} ${card?.textContent || ''} ${categories}`,
        target: { name: skill.name, installed: state.installedSkills.has(skill.name) }
      });
    });

    state.scheduledTasks.forEach((task) => {
      const projectName = state.projects.get(task.projectId)?.name || '未分类项目';
      entries.push({
        id: `scheduled-${task.id}`,
        type: 'scheduled',
        title: task.title,
        detail: `${task.runTask || 'Agent'} · ${projectName} · ${task.repeat} ${task.time}`,
        searchText: `${task.title} ${task.runTask || 'Agent'} ${projectName} ${task.repeat} ${task.time} ${task.notification}`,
        target: { taskId: task.id }
      });
    });

    return entries;
  }

  function highlightGlobalSearchText(value, query) {
    const text = String(value || '');
    if (!query) return escapeHtml(text);
    const lowerText = text.toLocaleLowerCase();
    const lowerQuery = query.toLocaleLowerCase();
    let cursor = 0;
    let match = lowerText.indexOf(lowerQuery);
    if (match < 0) return escapeHtml(text);
    let markup = '';
    while (match >= 0) {
      markup += `${escapeHtml(text.slice(cursor, match))}<mark>${escapeHtml(text.slice(match, match + query.length))}</mark>`;
      cursor = match + query.length;
      match = lowerText.indexOf(lowerQuery, cursor);
    }
    return markup + escapeHtml(text.slice(cursor));
  }

  function setGlobalSearchActiveIndex(index) {
    const options = $$('[data-global-search-result]');
    if (!options.length) {
      state.globalSearchActiveIndex = -1;
      $('[data-testid="search-input"]').setAttribute('aria-activedescendant', '');
      return;
    }
    state.globalSearchActiveIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      const active = optionIndex === state.globalSearchActiveIndex;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-selected', String(active));
      if (active) option.scrollIntoView({ block: 'nearest' });
    });
    $('[data-testid="search-input"]').setAttribute('aria-activedescendant', options[state.globalSearchActiveIndex].id);
  }

  function renderGlobalSearchResults() {
    const input = $('[data-testid="search-input"]');
    const root = $('[data-testid="global-search-results"]');
    const empty = $('[data-testid="global-search-empty"]');
    const query = input.value.trim();
    const normalized = query.toLocaleLowerCase();
    state.globalSearchQuery = input.value;
    $$('.nav-item').forEach((item) => {
      item.classList.toggle('search-match', Boolean(normalized) && item.textContent.toLocaleLowerCase().includes(normalized));
    });
    state.globalSearchResults = normalized
      ? buildGlobalSearchIndex().filter((entry) => entry.searchText.toLocaleLowerCase().includes(normalized))
      : [];
    state.globalSearchActiveIndex = -1;
    input.setAttribute('aria-activedescendant', '');
    input.setAttribute('aria-expanded', String(Boolean(normalized)));
    root.innerHTML = '';
    root.hidden = !normalized || !state.globalSearchResults.length;
    empty.hidden = !normalized || state.globalSearchResults.length > 0;
    if (!state.globalSearchResults.length) return;

    globalSearchGroupOrder.forEach((type) => {
      const grouped = state.globalSearchResults.filter((entry) => entry.type === type);
      if (!grouped.length) return;
      const section = document.createElement('section');
      section.className = 'global-search-group';
      section.setAttribute('role', 'group');
      section.setAttribute('aria-label', globalSearchGroupLabels[type]);
      section.innerHTML = `<h2 class="global-search-group-title">${globalSearchGroupLabels[type]}</h2>`;
      grouped.forEach((entry) => {
        const resultIndex = state.globalSearchResults.indexOf(entry);
        const button = document.createElement('button');
        button.type = 'button';
        button.id = `global-search-option-${resultIndex}`;
        button.className = 'global-search-result';
        button.dataset.globalSearchResult = entry.id;
        button.dataset.testid = 'global-search-result';
        button.setAttribute('role', 'option');
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('aria-disabled', String(Boolean(entry.disabled)));
        if (entry.reason) button.title = entry.reason;
        button.innerHTML = `<span class="global-search-result-copy"><span class="global-search-result-title">${highlightGlobalSearchText(entry.title, query)}</span><span class="global-search-result-detail">${highlightGlobalSearchText(entry.detail, query)}</span></span>${entry.reason ? `<span class="global-search-result-reason">${escapeHtml(entry.reason)}</span>` : ''}`;
        section.append(button);
      });
      root.append(section);
    });
  }

  function clearGlobalSearchTarget() {
    clearTimeout(state.globalSearchHighlightTimer);
    state.globalSearchHighlightTimer = null;
    $$('.search-target-highlight').forEach((element) => element.classList.remove('search-target-highlight'));
    const assetLocation = $('[data-testid="asset-search-location"]');
    if (assetLocation) assetLocation.hidden = true;
  }

  function highlightGlobalSearchTarget(element) {
    if (!element) return false;
    clearGlobalSearchTarget();
    element.hidden = false;
    element.classList.add('search-target-highlight');
    element.scrollIntoView({ block: 'center', behavior: 'smooth' });
    state.globalSearchHighlightTimer = setTimeout(() => {
      element.classList.remove('search-target-highlight');
      state.globalSearchHighlightTimer = null;
    }, 1800);
    return true;
  }

  function findKnowledgeSearchTarget(target) {
    return $$('[data-knowledge-row]').find((row) => row.dataset.trashed !== 'true' && row.dataset.name === target.name
      && (row.dataset.space || 'public') === target.space
      && (row.dataset.knowledgeDirectoryId || 'all') === target.directory);
  }

  function activateGlobalSearchResult(resultId) {
    const result = state.globalSearchResults.find((entry) => entry.id === resultId);
    if (!result || result.disabled) return false;
    const target = result.target;
    let element = null;

    if (result.type === 'function') {
      setView(target.view);
      if (target.view === 'projects') selectLibraryTab(target.libraryTab || 'projects');
      if (target.view === 'skills') {
        selectCapabilityTab(target.capability || 'skills');
        if ((target.capability || 'skills') === 'skills') selectSkillTab('plaza');
      }
      if (target.toolName) {
        const tool = creationTools.find((item) => item.name === target.toolName);
        if (tool) {
          setSelectedTool(tool.name);
          setPrompt(tool.prompt, false, true);
        }
      }
      return true;
    }

    if (result.type === 'project') {
      if (!state.projects.has(target.projectId)) return showMissingGlobalSearchTarget();
      focusSidebarProject(target.projectId);
      element = $(`[data-project-item][data-project-id="${target.projectId}"]`) || $(`[data-sidebar-project][data-project-id="${target.projectId}"]`);
    } else if (result.type === 'conversation') {
      const conversation = getConversation(target.projectId, target.conversationId);
      if (!conversation) return showMissingGlobalSearchTarget();
      openConversation(target.projectId, target.conversationId);
      element = target.messageId
        ? $(`[data-message-id="${target.messageId}"]`)
        : $('[data-testid="conversation-title"]');
    } else if (result.type === 'asset' && target.kind === 'project-file') {
      const file = $$('[data-project-file]').find((item) => item.dataset.projectId === target.projectId && item.dataset.projectFile === target.projectFile);
      if (!file || !state.projects.has(target.projectId)) return showMissingGlobalSearchTarget();
      openProjectDirectory(target.projectId, '项目内容', $(`[data-sidebar-project][data-project-id="${target.projectId}"]`));
      selectProjectFile(file);
      element = file;
    } else if (result.type === 'asset') {
      const asset = $$('[data-asset-picker-item]').find((item) => item.dataset.assetPickerItem === target.name
        && (item.dataset.projectId || '') === target.projectId);
      if (!asset) return showMissingGlobalSearchTarget();
      closeSearchPanel({ preserveHighlight: true });
      state.materialTarget = state.view === 'conversation' ? 'conversation' : 'home';
      openAssetPicker();
      setAssetPickerScope(target.scope || 'personal');
      if (target.projectId) {
        state.assetPickerProjectId = target.projectId;
        renderAssetPickerProjectOptions();
        filterAssetPickerItems();
      }
      selectAssetPickerItem(asset);
      element = asset;
    } else if (result.type === 'knowledge' && target.kind === 'space') {
      const button = $(`[data-knowledge-space="${target.space}"]`);
      if (!button) return showMissingGlobalSearchTarget();
      setView('knowledge');
      selectKnowledgeSpace(target.space);
      element = button;
    } else if (result.type === 'knowledge' && target.kind === 'directory') {
      const button = $(`[data-knowledge-directory="${target.directory}"]`);
      if (!button) return showMissingGlobalSearchTarget();
      setView('knowledge');
      selectKnowledgeSpace(target.space);
      selectKnowledgeDirectory(target.directory);
      element = $('[data-testid="knowledge-project-filter"]');
    } else if (result.type === 'knowledge') {
      const row = findKnowledgeSearchTarget(target);
      if (!row) return showMissingGlobalSearchTarget();
      setView('knowledge');
      selectKnowledgeSpace(target.space);
      selectKnowledgeDirectory(target.directory);
      $('[data-testid="knowledge-search"]').value = '';
      filterKnowledgeDocuments();
      $$('[data-knowledge-row]').forEach((candidate) => candidate.classList.toggle('active', candidate === row));
      element = row;
    } else if (result.type === 'skill') {
      const card = target.installed
        ? $$('[data-installed-skill]').find((candidate) => candidate.dataset.installedSkill === target.name)
        : $$('[data-skill-card]').find((candidate) => $('h2', candidate)?.textContent.trim() === target.name);
      if (!card) return showMissingGlobalSearchTarget();
      setView('skills');
      selectCapabilityTab('skills');
      selectSkillTab(target.installed ? 'mine' : 'plaza');
      selectSkillCategory('all');
      $('[data-testid="skill-search"]').value = '';
      filterSkills();
      element = card;
    } else if (result.type === 'scheduled') {
      if (!state.scheduledTasks.some((task) => task.id === target.taskId)) return showMissingGlobalSearchTarget();
      setView('scheduled-tasks');
      $('[data-testid="scheduled-task-search"]').value = '';
      renderScheduledTasks();
      element = $(`[data-scheduled-task-id="${target.taskId}"]`);
    }

    if (!element) return showMissingGlobalSearchTarget();
    highlightGlobalSearchTarget(element);
    return true;
  }

  function showMissingGlobalSearchTarget() {
    showToast('内容已不存在');
    const panel = $('[data-testid="search-panel"]');
    panel.hidden = false;
    $('[data-testid="search-trigger"]').setAttribute('aria-expanded', 'true');
    $('[data-testid="search-input"]').focus();
    return false;
  }

  function closeSearchPanel({ preserveHighlight = false } = {}) {
    const panel = $('[data-testid="search-panel"]');
    const trigger = $('[data-testid="search-trigger"]');
    if (panel) panel.hidden = true;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    $('[data-testid="search-input"]')?.setAttribute('aria-expanded', 'false');
    if (!preserveHighlight) clearGlobalSearchTarget();
  }

  function closeTransientDropdowns() {
    closeOverlays();
    closeSearchPanel();
    closeScheduledSelects();
    closeScheduledTimePicker();
    closeProjectMoveMenus();
    closeSidebarProjectActionMenu();
    closeProjectSortMenu();
  }

  function renderAccountRow() {
    const row = $('[data-testid="account-row"]');
    const account = mockAccounts.find((item) => item.id === state.activeAccountId);
    if (!account) {
      row.innerHTML = `
        <button class="account-login-trigger" type="button" data-action="account-login" data-testid="account-login-trigger" aria-label="登录账号" aria-haspopup="dialog" aria-expanded="false">
          <svg class="account-login-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 19c.8-3.6 3-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/></svg>
          <span class="account-login-label">登录账号</span>
        </button>`;
      return;
    }

    row.innerHTML = `
      <div class="account-summary" data-testid="account-summary">
        <span class="account-avatar" aria-hidden="true">${escapeHtml(account.avatar)}</span>
        <span class="account-identity">
          <strong class="account-name" data-testid="account-name">${escapeHtml(account.name)}</strong>
          <small class="account-role" data-testid="account-role">${escapeHtml(account.role)}</small>
        </span>
      </div>
      <button class="account-more" type="button" data-action="account" data-testid="account-more" aria-label="打开通知" aria-haspopup="dialog" aria-expanded="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.7"></circle><circle cx="12" cy="12" r="1.7"></circle><circle cx="12" cy="19" r="1.7"></circle></svg>
        <span class="account-unread-dot" data-testid="account-unread-dot" aria-label="有未读通知"></span>
      </button>`;
  }

  function renderAccountLoginOptions() {
    $('[data-account-login-list]').innerHTML = mockAccounts.map((account) => `
      <button class="account-login-option" type="button" data-action="select-login-account" data-account-id="${account.id}" aria-label="登录为 ${escapeHtml(account.name)}">
        <span class="account-avatar" aria-hidden="true">${escapeHtml(account.avatar)}</span>
        <span><strong>${escapeHtml(account.name)}</strong><small>${escapeHtml(account.role)}</small></span>
      </button>`).join('');
  }

  function logoutAccount() {
    state.activeAccountId = null;
    closeOverlays();
    renderAccountRow();
  }

  function loginAccount(accountId) {
    const account = mockAccounts.find((item) => item.id === accountId);
    if (!account) return;
    state.activeAccountId = account.id;
    renderAccountRow();
    closeOverlays();
    renderAccountNotifications();
    showToast(`已登录为 ${account.name}`);
  }

  function renderAccountNotifications() {
    const search = $('[data-testid="notification-search"]')?.value.trim().toLowerCase() || '';
    const unreadCount = state.notifications.filter((notification) => notification.unread).length;
    const visibleNotifications = state.notifications.filter((notification) => {
      const matchesFilter = state.notificationFilter === 'all' || notification.unread;
      const matchesSearch = !search || `${notification.title} ${notification.detail}`.toLowerCase().includes(search);
      return matchesFilter && matchesSearch;
    });
    const list = $('[data-testid="notification-list"]');
    const empty = $('[data-testid="notification-empty"]');
    const unreadDot = $('[data-testid="account-unread-dot"]');
    const markAllButton = $('[data-testid="notification-mark-all-read"]');

    list.innerHTML = visibleNotifications.map((notification) => `
      <button class="notification-item${notification.unread ? ' is-unread' : ''}" type="button" data-notification-id="${notification.id}" aria-label="${escapeHtml(notification.title)}${notification.unread ? '，未读' : ''}">
        <span class="notification-item-dot" aria-hidden="true"></span>
        <span class="notification-item-copy">
          <strong>${escapeHtml(notification.title)}</strong>
          <p>${escapeHtml(notification.detail)}</p>
        </span>
        <time>${escapeHtml(notification.time)}</time>
      </button>
    `).join('');
    empty.textContent = search ? '未找到通知' : state.notificationFilter === 'unread' ? '暂无未读通知' : '暂无通知';
    empty.hidden = visibleNotifications.length > 0;
    list.hidden = visibleNotifications.length === 0;
    $('[data-testid="notification-unread-count"]').textContent = unreadCount ? `${unreadCount} 条未读` : '';
    if (unreadDot) unreadDot.hidden = unreadCount === 0;
    markAllButton.disabled = unreadCount === 0;
    $$('[data-notification-filter]').forEach((button) => {
      button.setAttribute('aria-selected', String(button.dataset.notificationFilter === state.notificationFilter));
    });
    $$('[data-action="account"]').forEach((button) => {
      button.setAttribute('aria-label', unreadCount ? `打开通知，${unreadCount} 条未读` : '打开通知');
    });
  }

  function selectNotificationFilter(filter) {
    state.notificationFilter = filter === 'all' ? 'all' : 'unread';
    renderAccountNotifications();
  }

  function markNotificationRead(id) {
    const notification = state.notifications.find((item) => item.id === id);
    if (!notification || !notification.unread) return;
    notification.unread = false;
    renderAccountNotifications();
  }

  function markAllNotificationsRead() {
    const unreadNotifications = state.notifications.filter((notification) => notification.unread);
    if (!unreadNotifications.length) return;
    unreadNotifications.forEach((notification) => { notification.unread = false; });
    renderAccountNotifications();
  }

  function setView(view) {
    if (view !== 'knowledge') {
      closeKnowledgeDetail(false);
      closeKnowledgeMenu();
      closeKnowledgeItemDialog(false);
    }
    state.view = view;
    closeTransientDropdowns();
    closeCommandMenu();
    closeConversationShare();
    hideConversationHoverCard();
    if (view !== 'scheduled-tasks') closeScheduledTaskDrawer();
    if (view !== 'projects') {
      state.projectConversationPageId = null;
      $('[data-testid="project-directory-view"]')?.setAttribute('hidden', '');
      $('[data-testid="project-conversations-view"]')?.setAttribute('hidden', '');
      updateProjectConversationBackButton();
    } else {
      state.projectConversationPageId = null;
      $('[data-testid="project-directory-view"]')?.setAttribute('hidden', '');
      $('[data-testid="project-conversations-view"]')?.setAttribute('hidden', '');
      $('.project-toolbar')?.removeAttribute('hidden');
      $$('[data-project-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.projectPanel !== state.projectScope;
      });
      updateProjectConversationBackButton();
    }
    clearProjectTreeSelection();
    $$('[data-view]').forEach((panel) => { panel.hidden = panel.dataset.view !== view; });
    $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.nav === view && !item.classList.contains('resource-nav-parent')));
    $('.resource-nav-group')?.classList.toggle('is-section-active', view === 'knowledge' || view === 'scripts');
    if (view === 'knowledge' || view === 'scripts') setResourceNavExpanded(true);
    if (view === 'knowledge') window.KnowledgePrototypeBridge?.mount();
    if (view === 'scripts') window.ScriptLibrary?.mount();
    if (view === 'scheduled-tasks') renderScheduledTasks();
  }

  function setResourceNavExpanded(expanded) {
    const children = $('[data-testid="resource-nav-children"]');
    const toggle = $('[data-testid="resource-nav-toggle"]');
    if (!children || !toggle) return;
    children.hidden = !expanded;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? '收起知识库子菜单' : '展开知识库子菜单');
  }

  function clearProjectTreeSelection() {
    state.activeConversationId = null;
    $$('.project-tree .tree-row').forEach((row) => row.classList.remove('active'));
  }

  function renderModelOptions() {
    const root = $('[data-model-options]');
    const options = modelOptions[state.mode];
    const selected = state.selectedModels[state.mode];
    const rows = options.map((model) => {
      const row = document.createElement('button');
      const isSelected = selected.has(model.id);
      row.type = 'button';
      row.className = 'model-option';
      row.dataset.modelOption = model.id;
      row.setAttribute('role', 'checkbox');
      row.setAttribute('aria-label', model.name);
      row.setAttribute('aria-checked', String(isSelected));
      row.classList.toggle('selected', isSelected);
      const symbol = document.createElement('span');
      symbol.className = 'model-option-symbol';
      symbol.setAttribute('aria-hidden', 'true');
      symbol.textContent = model.name.slice(0, 1).toUpperCase();
      const copy = document.createElement('span');
      copy.className = 'model-option-copy';
      const name = document.createElement('strong');
      name.textContent = model.name;
      const description = document.createElement('small');
      description.textContent = model.description;
      copy.append(name, description);
      const check = document.createElement('i');
      check.setAttribute('aria-hidden', 'true');
      check.textContent = '✓';
      row.append(symbol, copy, check);
      return row;
    });
    root.replaceChildren(...rows);
    const allSelected = options.length > 0 && selected.size === options.length;
    $('[data-action="toggle-all-models"]').setAttribute('aria-checked', String(allSelected));
  }

  function toggleModel(id) {
    const selected = state.selectedModels[state.mode];
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    renderModelOptions();
  }

  function toggleAllModels() {
    const selected = state.selectedModels[state.mode];
    const options = modelOptions[state.mode];
    if (selected.size === options.length) selected.clear();
    else options.forEach((model) => selected.add(model.id));
    renderModelOptions();
  }

  function selectMode(id) {
    state.mode = id;
    $$('.model-tabs [role="tab"]').forEach((tab) => {
      const selected = tab.dataset.mode === id;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    const message = $('[data-testid="model-list-title"]');
    message.textContent = modeLabels[id];
    message.hidden = false;
    renderModelOptions();
  }

  function composerModuleId(type, name) {
    return `${type}:${name}`;
  }

  function syncLegacySelectedModules() {
    state.selectedSkill = [...state.selectedModules].reverse().find((module) => module.type === 'skill')?.name || null;
    state.selectedTool = [...state.selectedModules].reverse().find((module) => module.type === 'tool')?.name || null;
  }

  function copyComposerModules(modules = []) {
    return modules.map((module) => ({
      ...module,
      id: module.id || composerModuleId(module.type, module.name)
    }));
  }

  function normalizeSelectedComposerModules(modules = []) {
    const selected = [];
    const seenSkills = new Set();
    const singleTypeIndexes = new Map();
    copyComposerModules(modules).forEach((module) => {
      if (module.type === 'skill') {
        if (seenSkills.has(module.id)) return;
        seenSkills.add(module.id);
        selected.push(module);
        return;
      }
      const existingIndex = singleTypeIndexes.get(module.type);
      if (existingIndex === undefined) {
        singleTypeIndexes.set(module.type, selected.length);
        selected.push(module);
      } else {
        selected[existingIndex] = module;
      }
    });
    return selected;
  }

  function composerReferenceId(kind, name, origin = '') {
    if (kind === 'script' && origin) return `${kind}:${origin}`;
    return `${kind}:${origin ? `${origin}:` : ''}${name}`;
  }

  function assetReferenceOrigin(item) {
    return `${item.dataset.assetPickerItemScope || 'personal'}:${item.dataset.projectId || 'none'}`;
  }

  function knowledgeReferenceOrigin(row) {
    return `${row.dataset.space || 'public'}:${row.dataset.knowledgeDirectoryId || 'all'}`;
  }

  function copyComposerReferences(references = []) {
    return references.map((reference) => ({
      ...reference,
      id: reference.id || composerReferenceId(reference.kind, reference.name)
    }));
  }

  function renderComposerReferences(surface = 'home') {
    const isConversation = surface === 'conversation';
    const container = $(`[data-testid="${isConversation ? 'conversation-' : 'home-'}selected-references"]`);
    if (!container) return;
    const pickerAsset = isConversation ? state.conversationAsset : state.selectedAsset;
    const entries = [];
    if (!isConversation && state.selectedConnector) {
      entries.push({
        id: `${surface}:legacy-connector`,
        kind: 'connector',
        name: state.selectedConnector,
        label: `@${state.selectedConnector} · 暂不支持`,
        removableContext: 'connector',
        unavailable: true
      });
    }
    state.selectedReferences[surface].forEach((reference) => {
      entries.push({
        ...reference,
        label: reference.source === 'picker'
          ? `${reference.kind === 'knowledge' ? '资料' : reference.kind === 'script' ? '脚本' : '素材'} · ${reference.name}`
          : `@${reference.name}`,
        removableContext: 'reference'
      });
    });
    if (pickerAsset) {
      entries.splice(Math.min(state.selectedAssetSlots[surface], entries.length), 0, {
        id: `${surface}:picker-asset`,
        kind: 'asset',
        name: pickerAsset,
        label: `素材 · ${pickerAsset}`,
        removableContext: isConversation ? 'conversation-asset' : 'asset'
      });
    }

    let firstAsset = true;
    let firstConnector = true;
    const chips = entries.map((entry) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `selected-${entry.kind}-chip`;
      chip.textContent = entry.label;
      chip.dataset.composerFlowItem = 'true';
      chip.dataset.removableContext = entry.removableContext;
      if (entry.removableContext === 'reference') {
        chip.dataset.composerReference = entry.id;
        chip.dataset.referenceSurface = surface;
        chip.dataset.action = 'remove-composer-reference';
        chip.dataset.commandTone = entry.tone || entry.kind;
      }
      if ((entry.kind === 'asset' || entry.kind === 'knowledge') && firstAsset) {
        chip.dataset.testid = `${isConversation ? 'conversation-' : ''}selected-asset-chip`;
        firstAsset = false;
      }
      if (entry.kind === 'connector' && firstConnector) {
        chip.dataset.testid = `${isConversation ? 'conversation-' : ''}selected-connector-chip`;
        firstConnector = false;
      }
      if (entry.unavailable) {
        chip.classList.add('is-unavailable');
        chip.setAttribute('aria-disabled', 'true');
      }
      chip.setAttribute('aria-label', `${entry.kind === 'asset' ? '素材' : entry.kind === 'knowledge' ? '资料' : entry.kind === 'script' ? '脚本' : '连接器'} ${entry.name}，按 Delete 或 Backspace 移除`);
      return chip;
    });
    container.replaceChildren(...chips);
    container.hidden = chips.length === 0;
    if (!isConversation) renderHomeComposerTextFlow();
  }

  function addComposerReference(surface, kind, name, tone = '', source = 'mention', origin = '') {
    const references = state.selectedReferences[surface];
    if (!name || !references) return false;
    if (surface === 'home') syncHomeComposerTextSlots();
    const homeInput = surface === 'home' ? $('[data-testid="prompt-input"]') : null;
    const previousHomeItemCount = surface === 'home'
      ? state.selectedModules.length + references.length + (state.selectedAsset ? 1 : 0) + (state.selectedConnector ? 1 : 0)
      : 0;
    const previousHomeSlot = Number.isInteger(state.homeComposerTextSlot)
      ? state.homeComposerTextSlot
      : previousHomeItemCount;
    const id = composerReferenceId(kind, name, origin);
    const existing = references.find((reference) => reference.id === id);
    if (existing) {
      if (kind === 'script' && existing.name !== name) {
        existing.name = name;
        renderComposerReferences(surface);
      }
      return false;
    }
    const sameKindIndex = references.findIndex((reference) => reference.kind === kind);
    if (kind === 'connector' && surface === 'home') state.selectedConnector = null;
    const reference = { id, kind, name, tone: tone || kind, source, origin };
    if (kind === 'connector' && sameKindIndex >= 0) {
      references[sameKindIndex] = reference;
    } else {
      references.push(reference);
    }
    if (surface === 'home') {
      state.homeComposerTextSlot = previousHomeItemCount === 0
        ? (homeInput?.value.trim() ? previousHomeSlot : 1)
        : Math.min(previousHomeSlot, previousHomeItemCount + 1);
    }
    renderComposerReferences(surface);
    return true;
  }

  function removeComposerReference(surface, id) {
    const references = state.selectedReferences[surface];
    if (!references) return false;
    const index = references.findIndex((reference) => reference.id === id);
    if (index < 0) return false;
    const pickerAsset = surface === 'conversation' ? state.conversationAsset : state.selectedAsset;
    if (pickerAsset && index < state.selectedAssetSlots[surface]) {
      state.selectedAssetSlots[surface] -= 1;
    }
    references.splice(index, 1);
    renderComposerReferences(surface);
    return true;
  }

  function clearComposerReferences(surface) {
    state.selectedAssetSlots[surface] = 0;
    if (!state.selectedReferences[surface]?.length) return false;
    state.selectedReferences[surface] = [];
    renderComposerReferences(surface);
    return true;
  }

  function reconcileComposerAssetProject(projectId, destinationId = null) {
    ['home', 'conversation'].forEach((surface) => {
      const references = state.selectedReferences[surface];
      const belongsToProject = (reference) => reference.kind === 'asset'
        && reference.origin?.slice(reference.origin.lastIndexOf(':') + 1) === projectId;
      if (!references.some(belongsToProject)) return;
      if (!destinationId) {
        const removedBeforeAsset = references.slice(0, state.selectedAssetSlots[surface]).filter(belongsToProject).length;
        state.selectedAssetSlots[surface] -= removedBeforeAsset;
        state.selectedReferences[surface] = references.filter((reference) => !belongsToProject(reference));
      } else {
        state.selectedReferences[surface] = references.map((reference) => {
          if (!belongsToProject(reference)) return reference;
          const scope = reference.origin.slice(0, reference.origin.lastIndexOf(':'));
          const origin = `${scope}:${destinationId}`;
          return { ...reference, origin, id: composerReferenceId('asset', reference.name, origin) };
        });
      }
      renderComposerReferences(surface);
    });
  }

  function syncActiveConversationModules() {
    if (state.view !== 'conversation') return;
    const view = $('[data-testid="conversation-view"]');
    const conversation = getConversation(view?.dataset.projectId, view?.dataset.conversationId);
    if (!conversation) return;
    conversation.modules = copyComposerModules(state.selectedModules);
    conversation.skill = state.selectedSkill;
    conversation.tool = state.selectedTool;
  }

  function replaceComposerModules(modules = [], persist = false) {
    state.selectedModules = normalizeSelectedComposerModules(modules);
    state.conversationModuleTextSlots = Array.from({ length: state.selectedModules.length + 1 }, () => '');
    state.conversationModuleTextSlot = state.view === 'conversation'
      ? Math.max(0, state.selectedModules.length > 1 ? state.selectedModules.length - 1 : state.selectedModules.length)
      : null;
    syncLegacySelectedModules();
    renderComposerModules();
    if (persist) syncActiveConversationModules();
  }

  function renderConversationModuleTextFlow() {
    const row = $('[data-testid="conversation-composer"] .conversation-composer-input-row');
    const input = $('[data-testid="conversation-input"]');
    const container = $('[data-testid="conversation-selected-modules"]');
    if (!row || !input || !container) return;
    const slotCount = state.selectedModules.length + 1;
    if (!Array.isArray(state.conversationModuleTextSlots)) state.conversationModuleTextSlots = [];
    while (state.conversationModuleTextSlots.length < slotCount) state.conversationModuleTextSlots.push('');
    if (state.conversationModuleTextSlots.length > slotCount) state.conversationModuleTextSlots.length = slotCount;
    const slot = Number.isInteger(state.conversationModuleTextSlot)
      ? Math.max(0, Math.min(state.conversationModuleTextSlot, state.selectedModules.length))
      : Math.max(0, state.selectedModules.length > 1 ? state.selectedModules.length - 1 : state.selectedModules.length);
    const inline = state.view === 'conversation'
      && state.selectedModules.length > 0;
    if (inline) row.dataset.moduleTextFlow = 'inline';
    else delete row.dataset.moduleTextFlow;
    state.conversationModuleTextSlot = inline ? slot : null;
    input.dataset.moduleTextSlot = String(slot);
    input.dataset.conversationTextInput = 'active';
    input.value = state.conversationModuleTextSlots[slot] || '';
    $$('.conversation-text-slot', row).forEach((textSlot) => textSlot.remove());
    if (inline) {
      state.conversationModuleTextSlots.forEach((value, index) => {
        if (index === slot) return;
        const textSlot = document.createElement('span');
        textSlot.className = 'conversation-text-slot';
        textSlot.dataset.conversationTextSlot = String(index);
        textSlot.dataset.composerTextSlot = String(index);
        textSlot.dataset.composerTextSurface = 'conversation';
        textSlot.contentEditable = 'true';
        textSlot.setAttribute('role', 'textbox');
        textSlot.setAttribute('aria-label', `第${index + 1}段对话文字`);
        textSlot.dataset.placeholder = '输入文字';
        textSlot.textContent = value || '';
        textSlot.style.order = String(index * 2);
        row.append(textSlot);
      });
    }
    input.style.order = inline ? String(slot * 2) : '';
    $$('[data-composer-module]', container).forEach((chip, index) => {
      chip.style.order = inline ? String(index * 2 + 1) : '';
    });
    const references = $('[data-testid="conversation-selected-references"]');
    if (references) references.style.order = inline ? String(state.selectedModules.length * 2 + 2) : '';
  }

  function syncConversationModuleTextSlots() {
    if (state.view !== 'conversation') return;
    const input = $('[data-testid="conversation-input"]');
    const inputSlot = Number(input?.dataset.moduleTextSlot);
    if (input && Number.isInteger(inputSlot)) {
      state.conversationModuleTextSlots[inputSlot] = input.value;
    }
    $$('[data-conversation-text-slot]').forEach((textSlot) => {
      state.conversationModuleTextSlots[Number(textSlot.dataset.conversationTextSlot)] = textSlot.textContent;
    });
  }

  function getConversationComposerText() {
    syncConversationModuleTextSlots();
    return state.conversationModuleTextSlots.filter((text) => text.trim()).join(' ').trim();
  }

  function activateConversationTextSlot(index) {
    if (state.view !== 'conversation') return;
    syncConversationModuleTextSlots();
    state.conversationModuleTextSlot = Math.max(0, Math.min(index, state.selectedModules.length));
    renderConversationModuleTextFlow();
    const input = $('[data-testid="conversation-input"]');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  function syncHomeComposerTextSlots() {
    const input = $('[data-testid="prompt-input"]');
    const inputSlot = Number(input?.dataset.moduleTextSlot);
    if (input && Number.isInteger(inputSlot)) {
      state.homeComposerTextSlots[inputSlot] = input.value;
    }
    $$('[data-composer-text-surface="home"]').forEach((textSlot) => {
      state.homeComposerTextSlots[Number(textSlot.dataset.composerTextSlot)] = textSlot.textContent;
    });
  }

  function getHomeComposerText() {
    syncHomeComposerTextSlots();
    return state.homeComposerTextSlots.filter((text) => text.trim()).join(' ').trim();
  }

  function renderHomeComposerTextFlow() {
    const row = $('[data-testid="composer"] .composer-input-row');
    const input = $('[data-testid="prompt-input"]');
    if (!row || !input) return;
    syncHomeComposerTextSlots();
    const previousSlot = Number(input.dataset.moduleTextSlot);
    const previousSelectionStart = input.selectionStart;
    const previousSelectionEnd = input.selectionEnd;
    const wasFocused = document.activeElement === input;
    const items = $$('[data-composer-flow-item]', row);
    const slotCount = items.length + 1;
    if (!Array.isArray(state.homeComposerTextSlots)) state.homeComposerTextSlots = [];
    while (state.homeComposerTextSlots.length < slotCount) state.homeComposerTextSlots.push('');
    if (state.homeComposerTextSlots.length > slotCount) state.homeComposerTextSlots.length = slotCount;
    const slot = Number.isInteger(state.homeComposerTextSlot)
      ? Math.max(0, Math.min(state.homeComposerTextSlot, items.length))
      : items.length;
    const inline = items.length > 0;
    const hasEarlierText = state.homeComposerTextSlots.some((value, index) => index < items.length && Boolean(value?.trim()));
    const prefixFlow = inline && slot === items.length && !hasEarlierText && Boolean(state.homeComposerTextSlots[slot]?.trim());
    if (prefixFlow) row.dataset.moduleTextFlow = 'prefix';
    else if (inline) row.dataset.moduleTextFlow = 'inline';
    else delete row.dataset.moduleTextFlow;
    state.homeComposerTextSlot = inline ? slot : null;
    input.dataset.moduleTextSlot = String(slot);
    input.dataset.composerTextSurface = 'home';
    input.value = state.homeComposerTextSlots[slot] || '';
    if (wasFocused && previousSlot === slot) {
      const start = Math.min(previousSelectionStart ?? input.value.length, input.value.length);
      const end = Math.min(previousSelectionEnd ?? start, input.value.length);
      input.setSelectionRange(start, end);
    }
    $$('.composer-text-slot[data-composer-text-surface="home"]', row).forEach((textSlot) => textSlot.remove());
    if (inline && !prefixFlow) {
      state.homeComposerTextSlots.forEach((value, index) => {
        if (index === slot) return;
        const textSlot = document.createElement('span');
        textSlot.className = 'composer-text-slot';
        textSlot.dataset.composerTextSlot = String(index);
        textSlot.dataset.composerTextSurface = 'home';
        textSlot.contentEditable = 'true';
        textSlot.setAttribute('role', 'textbox');
        textSlot.setAttribute('aria-label', `第${index + 1}段创作文字`);
        textSlot.dataset.placeholder = '输入文字';
        textSlot.textContent = value || '';
        textSlot.style.order = String(index * 2);
        row.append(textSlot);
      });
    }
    input.style.order = prefixFlow ? String(items.length) : inline ? String(slot * 2) : '';
    items.forEach((item, index) => {
      item.style.order = prefixFlow ? String(index) : inline ? String(index * 2 + 1) : '';
    });
  }

  function activateHomeComposerTextSlot(index) {
    syncHomeComposerTextSlots();
    const items = $$('[data-composer-flow-item]', $('[data-testid="composer"] .composer-input-row'));
    state.homeComposerTextSlot = Math.max(0, Math.min(index, items.length));
    renderHomeComposerTextFlow();
    const input = $('[data-testid="prompt-input"]');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  function renderComposerModules() {
    $$('[data-testid="home-selected-modules"], [data-testid="conversation-selected-modules"]').forEach((container) => {
      const isConversation = container.dataset.testid === 'conversation-selected-modules';
      const chips = state.selectedModules.map((module) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `composer-module selected-${module.type}-chip`;
        chip.dataset.testid = `${isConversation ? 'conversation-' : ''}selected-${module.type}-chip`;
        chip.dataset.composerModule = module.id;
        chip.dataset.composerFlowItem = 'true';
        chip.dataset.removableContext = 'module';
        chip.dataset.commandTone = module.tone;
        chip.draggable = true;
        chip.tabIndex = 0;
        const handle = document.createElement('span');
        handle.className = 'composer-module-handle';
        handle.setAttribute('aria-hidden', 'true');
        handle.innerHTML = '<svg viewBox="0 0 10 14"><circle cx="3" cy="3" r="1"/><circle cx="7" cy="3" r="1"/><circle cx="3" cy="7" r="1"/><circle cx="7" cy="7" r="1"/><circle cx="3" cy="11" r="1"/><circle cx="7" cy="11" r="1"/></svg>';
        const label = document.createElement('span');
        label.className = 'composer-module-label';
        label.textContent = module.type === 'skill' ? `/${module.name}` : `工具 · ${module.name}`;
        chip.append(handle, label);
        chip.title = '拖动调整顺序';
        chip.setAttribute('aria-label', `${module.type === 'skill' ? 'Skill' : '创作工具'} ${module.name}，拖动调整顺序，按 Delete 或 Backspace 移除`);
        return chip;
      });
      container.replaceChildren(...chips);
      container.hidden = chips.length === 0;
      if (!isConversation) renderHomeComposerTextFlow();
    });
    $$('[data-action="skill"]').forEach((trigger) => {
      trigger.classList.toggle('has-selection', state.selectedModules.some((module) => module.type === 'skill'));
    });
    renderConversationModuleTextFlow();
  }

  function addComposerModule(type, name, tone = '') {
    if (!name) return false;
    const id = composerModuleId(type, name);
    if (state.selectedModules.some((module) => module.id === id)) return false;
    const conversationInput = $('[data-testid="conversation-input"]');
    const isConversation = state.view === 'conversation' && conversationInput;
    if (isConversation) syncConversationModuleTextSlots();
    const homeInput = $('[data-testid="prompt-input"]');
    const isHome = state.view === 'create' && homeInput;
    if (isHome) syncHomeComposerTextSlots();
    const hasConversationText = Boolean(isConversation && conversationInput.value.trim());
    const hasHomeText = Boolean(isHome && homeInput.value.trim());
    const previousModuleCount = state.selectedModules.length;
    const previousHomeTextSlot = Number.isInteger(state.homeComposerTextSlot) ? state.homeComposerTextSlot : 0;
    const previousHomeFlowItemCount = previousModuleCount + state.selectedReferences.home.length;
    const previousHomeText = isHome ? state.homeComposerTextSlots[previousHomeTextSlot] || '' : '';
    const previousTextSlot = Number.isInteger(state.conversationModuleTextSlot)
      ? state.conversationModuleTextSlot
      : previousModuleCount;
    const tool = type === 'tool' ? creationTools.find((item) => item.name === name) : null;
    const module = {
      id,
      type,
      name,
      tone: tone || (type === 'skill' ? 'skill' : `tool-${tool?.visual || 'primary'}`)
    };
    const sameTypeIndex = type === 'skill' ? -1 : state.selectedModules.findIndex((entry) => entry.type === type);
    if (sameTypeIndex >= 0) state.selectedModules[sameTypeIndex] = module;
    else state.selectedModules.push(module);
    if (isConversation) {
      state.conversationModuleTextSlot = previousModuleCount === 0
        ? (hasConversationText ? previousTextSlot : state.selectedModules.length)
        : Math.min(previousTextSlot, state.selectedModules.length);
    }
    if (isHome) {
      const itemCountBefore = previousModuleCount + state.selectedReferences.home.length;
      const nextFlowItemCount = state.selectedModules.length + state.selectedReferences.home.length;
      const trailingPrompt = previousHomeTextSlot === previousHomeFlowItemCount && Boolean(previousHomeText.trim());
      if (trailingPrompt) {
        state.homeComposerTextSlots[previousHomeTextSlot] = '';
        state.homeComposerTextSlots[nextFlowItemCount] = previousHomeText;
        state.homeComposerTextSlot = nextFlowItemCount;
        $(`[data-composer-text-surface="home"][data-composer-text-slot="${previousHomeTextSlot}"]`)?.replaceChildren();
        homeInput.dataset.moduleTextSlot = String(nextFlowItemCount);
        homeInput.value = previousHomeText;
      } else if (itemCountBefore === 0 || !state.homeComposerTextSlots.some((value) => Boolean(value?.trim()))) {
        state.homeComposerTextSlot = nextFlowItemCount;
      } else {
        state.homeComposerTextSlot = Math.min(state.homeComposerTextSlot ?? itemCountBefore, nextFlowItemCount);
      }
    }
    syncLegacySelectedModules();
    renderComposerModules();
    syncActiveConversationModules();
    return true;
  }

  function removeComposerModule(id) {
    const index = state.selectedModules.findIndex((module) => module.id === id);
    if (index < 0) return false;
    if (state.view === 'conversation') syncConversationModuleTextSlots();
    state.selectedModules.splice(index, 1);
    if (state.view === 'conversation') {
      const left = state.conversationModuleTextSlots[index] || '';
      const right = state.conversationModuleTextSlots[index + 1] || '';
      state.conversationModuleTextSlots.splice(index, 2, [left, right].filter(Boolean).join(' '));
      state.conversationModuleTextSlot = state.selectedModules.length
        ? Math.min(state.conversationModuleTextSlot ?? state.selectedModules.length, state.selectedModules.length)
        : null;
    }
    syncLegacySelectedModules();
    renderComposerModules();
    syncActiveConversationModules();
    return true;
  }

  function moveComposerModule(sourceId, targetId = null, placeAfter = false) {
    if (!sourceId || sourceId === targetId) return false;
    const sourceIndex = state.selectedModules.findIndex((module) => module.id === sourceId);
    if (sourceIndex < 0) return false;
    const [source] = state.selectedModules.splice(sourceIndex, 1);
    if (!targetId) {
      if (placeAfter) state.selectedModules.push(source);
      else state.selectedModules.unshift(source);
      syncLegacySelectedModules();
      renderComposerModules();
      syncActiveConversationModules();
      return true;
    }
    const targetIndex = state.selectedModules.findIndex((module) => module.id === targetId);
    if (targetIndex < 0) {
      state.selectedModules.splice(sourceIndex, 0, source);
      return false;
    }
    state.selectedModules.splice(targetIndex + (placeAfter ? 1 : 0), 0, source);
    syncLegacySelectedModules();
    renderComposerModules();
    syncActiveConversationModules();
    return true;
  }

  function clearComposerModuleDragState() {
    state.draggedComposerModuleId = null;
    state.composerModuleDropId = null;
    state.composerModuleDropAfter = false;
    state.composerModuleDropTextSlot = null;
    $$('[data-composer-module]').forEach((module) => {
      module.classList.remove('is-dragging', 'is-drop-before', 'is-drop-after');
    });
    $$('[data-composer-text-slot]').forEach((textSlot) => textSlot.classList.remove('is-drop-target'));
    $$('.composer-modules').forEach((container) => {
      container.classList.remove('is-drop-at-start', 'is-drop-at-end');
    });
  }

  function moveComposerModuleToTextSlot(sourceId, surface, slotIndex) {
    if (surface === 'home') syncHomeComposerTextSlots();
    else if (surface === 'conversation') syncConversationModuleTextSlots();
    else return false;
    const sourceIndex = state.selectedModules.findIndex((module) => module.id === sourceId);
    if (sourceIndex < 0) return false;
    const [source] = state.selectedModules.splice(sourceIndex, 1);
    const moduleSlotIndex = Math.min(Number(slotIndex), state.selectedModules.length + 1);
    const insertionIndex = Math.max(0, Math.min(
      moduleSlotIndex - (sourceIndex < moduleSlotIndex ? 1 : 0),
      state.selectedModules.length
    ));
    state.selectedModules.splice(insertionIndex, 0, source);
    if (surface === 'home') {
      state.homeComposerTextSlot = Math.min(
        state.homeComposerTextSlot ?? state.selectedModules.length,
        state.selectedModules.length + state.selectedReferences.home.length
      );
    } else {
      state.conversationModuleTextSlot = Math.min(
        state.conversationModuleTextSlot ?? state.selectedModules.length,
        state.selectedModules.length
      );
    }
    syncLegacySelectedModules();
    renderComposerModules();
    syncActiveConversationModules();
    return true;
  }

  function clearComposerModules(type = null, persist = true) {
    const next = type
      ? state.selectedModules.filter((module) => module.type !== type)
      : [];
    if (next.length === state.selectedModules.length) return false;
    state.selectedModules = next;
    if (!state.selectedModules.length) {
      state.conversationModuleTextSlot = null;
      state.conversationModuleTextSlots = [''];
    }
    else if (state.view === 'conversation') {
      state.conversationModuleTextSlot = Math.min(
        state.conversationModuleTextSlot ?? state.selectedModules.length,
        state.selectedModules.length
      );
    }
    syncLegacySelectedModules();
    renderComposerModules();
    if (persist) syncActiveConversationModules();
    return true;
  }

  function setSelectedSkill(name, tone = 'skill') {
    if (name) addComposerModule('skill', name, tone);
    else clearComposerModules('skill');
  }

  function setSelectedTool(name, tone = '') {
    if (name) addComposerModule('tool', name, tone);
    else clearComposerModules('tool');
  }

  function removeSelectedComposerContext(type = null, contextId = null, surface = 'home') {
    if (type === 'reference' && contextId) return removeComposerReference(surface, contextId);
    const moduleId = contextId;
    if (type === 'module' && moduleId) return removeComposerModule(moduleId);
    if (type === 'skill') return clearComposerModules('skill');
    if (type === 'tool') return clearComposerModules('tool');
    if (!type && state.selectedModules.length) {
      return removeComposerModule(state.selectedModules[state.selectedModules.length - 1].id);
    }
    if ((type === 'asset' || (!type && surface === 'home')) && state.selectedAsset) {
      setSelectedAsset(null);
      return true;
    }
    if ((type === 'connector' || (!type && surface === 'home')) && state.selectedConnector) {
      setSelectedConnector(null);
      return true;
    }
    if ((type === 'conversation-asset' || (!type && surface === 'conversation')) && state.conversationAsset) {
      setSelectedAsset(null, 'conversation');
      return true;
    }
    if (!type && state.selectedReferences[surface]?.length) {
      const references = state.selectedReferences[surface];
      return removeComposerReference(surface, references[references.length - 1].id);
    }
    return false;
  }

  function setSelectedAsset(name, surface = 'home') {
    const isConversation = surface === 'conversation';
    const key = isConversation ? 'conversationAsset' : 'selectedAsset';
    if (name && !state[key]) state.selectedAssetSlots[surface] = state.selectedReferences[surface].length;
    if (!name) state.selectedAssetSlots[surface] = 0;
    state[key] = name || null;
    renderComposerReferences(surface);
  }

  function setSelectedConnector(name) {
    if (name) state.selectedReferences.home = state.selectedReferences.home.filter((reference) => reference.kind !== 'connector');
    state.selectedConnector = name || null;
    renderComposerReferences('home');
  }

  function setPrompt(text, preserveSkill = false, preserveTool = false) {
    if (!preserveSkill && !preserveTool) clearComposerModules();
    const input = $('[data-testid="prompt-input"]');
    input.value = text;
    input.focus();
  }

  function showToast(message) {
    const toast = $('[data-testid="toast"]');
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
  }

  function getCommandContext(input) {
    if (!input || input.selectionStart !== input.selectionEnd) return null;
    const end = input.selectionStart;
    const beforeCaret = input.value.slice(0, end);
    const match = beforeCaret.match(/(?:^|[\s，。！？、,.;:()[\]{}])([@/])([^\s@/]*)$/);
    if (!match) return null;
    return {
      trigger: match[1],
      query: match[2],
      start: end - match[2].length - 1,
      end
    };
  }

  function getCommandCatalog(trigger) {
    if (trigger === '@') {
      const assets = $$('[data-asset-picker-item]').map((item) => ({
        group: '素材',
        kind: 'asset',
        tone: 'asset',
        name: item.dataset.assetPickerItem,
        origin: assetReferenceOrigin(item),
        description: $('small', item)?.textContent.trim() || '项目素材'
      }));
      const connectors = $$('[data-connect][data-connector-available="true"]').map((item) => ({
        group: '连接器',
        kind: 'connector',
        tone: 'connector',
        name: item.dataset.connect,
        description: $('p', item.closest('.connector-card'))?.textContent.trim() || '已配置连接器'
      }));
      return [...assets, ...connectors];
    }

    const skills = new Map();
    $$('[data-skill-card]').forEach((card) => {
      const name = $('h2', card)?.textContent.trim();
      if (!name) return;
      skills.set(name, {
        group: 'Skill',
        kind: 'skill',
        tone: 'skill',
        name,
        description: $('p', card)?.textContent.trim() || 'Skill 广场'
      });
    });
    state.installedSkills.forEach((name) => {
      skills.set(name, {
        group: 'Skill',
        kind: 'skill',
        tone: 'skill',
        name,
        description: '我的 Skill'
      });
    });
    const tools = creationTools
      .filter((tool) => tool.available !== false)
      .map((tool) => ({
        group: '创作工具',
        kind: 'tool',
        tone: `tool-${tool.visual}`,
        name: tool.name,
        description: `${creationCategoryLabels[tool.category]} · ${tool.description}`
      }));
    return [...tools, ...skills.values()];
  }

  function positionCommandMenu() {
    const menu = $('[data-testid="command-menu"]');
    const input = commandMenuState.input;
    if (!menu || menu.hidden || !input) return;
    const inputRect = input.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const left = Math.max(12, Math.min(inputRect.left, window.innerWidth - menuRect.width - 12));
    const above = inputRect.top - menuRect.height - 8;
    const top = above >= 12
      ? above
      : Math.min(inputRect.bottom + 8, window.innerHeight - menuRect.height - 12);
    menu.style.left = `${left}px`;
    menu.style.top = `${Math.max(12, top)}px`;
  }

  function syncCommandMenuSelection() {
    const input = commandMenuState.input;
    $$('[data-command-option]').forEach((option, index) => {
      const selected = index === commandMenuState.activeIndex;
      option.setAttribute('aria-selected', String(selected));
      if (selected) option.scrollIntoView({ block: 'nearest' });
    });
    const active = $('[data-command-option][aria-selected="true"]');
    if (input && active) input.setAttribute('aria-activedescendant', active.id);
    else input?.removeAttribute('aria-activedescendant');
  }

  function renderCommandMenu() {
    const menu = $('[data-testid="command-menu"]');
    menu.replaceChildren();
    if (!commandMenuState.items.length) {
      const empty = document.createElement('p');
      empty.className = 'command-menu-empty';
      empty.textContent = '没有找到匹配的指令';
      menu.append(empty);
    } else {
      const groups = new Map();
      commandMenuState.items.forEach((item, index) => {
        if (!groups.has(item.group)) groups.set(item.group, []);
        groups.get(item.group).push({ item, index });
      });
      groups.forEach((entries, group) => {
        const section = document.createElement('section');
        section.className = 'command-menu-group';
        section.setAttribute('role', 'group');
        section.setAttribute('aria-label', group);
        const heading = document.createElement('p');
        heading.className = 'command-menu-group-title';
        heading.textContent = group;
        section.append(heading);
        entries.forEach(({ item, index }) => {
          const option = document.createElement('button');
          option.type = 'button';
          option.className = 'command-menu-option';
          option.id = `command-option-${index}`;
          option.dataset.commandOption = String(index);
          option.setAttribute('role', 'option');
          option.setAttribute('aria-selected', String(index === commandMenuState.activeIndex));
          option.setAttribute('aria-disabled', String(Boolean(item.disabled)));
          if (item.disabled) {
            option.classList.add('is-disabled');
            option.setAttribute('aria-label', `${item.name}，连接器，${item.reason}`);
          }
          const mark = document.createElement('span');
          mark.className = `command-menu-option-mark command-menu-option-mark--${item.tone || item.kind}`;
          mark.textContent = item.kind === 'asset'
            ? '素'
            : item.kind === 'connector'
              ? '连'
              : item.kind === 'tool'
                ? '创'
                : '技';
          const copy = document.createElement('span');
          copy.className = 'command-menu-option-copy';
          const name = document.createElement('strong');
          name.textContent = item.name;
          const description = document.createElement('small');
          description.textContent = item.description;
          copy.append(name, description);
          option.append(mark, copy);
          if (item.disabled) {
            const status = document.createElement('span');
            status.className = 'command-menu-option-status';
            status.textContent = item.reason;
            option.append(status);
          }
          section.append(option);
        });
        menu.append(section);
      });
    }
    menu.hidden = false;
    commandMenuState.input.setAttribute('aria-expanded', 'true');
    syncCommandMenuSelection();
    positionCommandMenu();
  }

  function closeCommandMenu() {
    const menu = $('[data-testid="command-menu"]');
    if (menu) menu.hidden = true;
    $$('[data-command-input]').forEach((input) => {
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    });
    commandMenuState.input = null;
    commandMenuState.trigger = null;
    commandMenuState.start = -1;
    commandMenuState.end = -1;
    commandMenuState.items = [];
    commandMenuState.activeIndex = -1;
  }

  function updateCommandMenu(input) {
    const context = getCommandContext(input);
    if (!context) return closeCommandMenu();
    const query = context.query.trim().toLowerCase();
    commandMenuState.input = input;
    commandMenuState.trigger = context.trigger;
    commandMenuState.start = context.start;
    commandMenuState.end = context.end;
    commandMenuState.items = getCommandCatalog(context.trigger).filter((item) => (
      !query || `${item.name} ${item.description}`.toLowerCase().includes(query)
    ));
    commandMenuState.activeIndex = -1;
    renderCommandMenu();
  }

  function selectCommandItem(index = commandMenuState.activeIndex) {
    const input = commandMenuState.input;
    const resolvedIndex = index < 0 ? 0 : index;
    const item = commandMenuState.items[resolvedIndex];
    if (!input || !item) return false;
    if (item.disabled) return false;
    const surface = composerSurfaceFor(input);
    if (item.kind === 'asset' || item.kind === 'connector') {
      input.setRangeText('', commandMenuState.start, commandMenuState.end, 'end');
      addComposerReference(surface, item.kind, item.name, item.tone, 'mention', item.origin || '');
    } else if (surface === 'home') {
      input.setRangeText('', commandMenuState.start, commandMenuState.end, 'end');
      if (item.kind === 'tool') {
        setSelectedTool(item.name, item.tone);
      } else {
        setSelectedSkill(item.name, item.tone);
      }
    } else if (item.kind === 'tool' || item.kind === 'skill') {
      input.setRangeText('', commandMenuState.start, commandMenuState.end, 'end');
      if (item.kind === 'tool') setSelectedTool(item.name, item.tone);
      else setSelectedSkill(item.name, item.tone);
    } else {
      const insertion = `${commandMenuState.trigger}${item.name} `;
      input.setRangeText(insertion, commandMenuState.start, commandMenuState.end, 'end');
    }
    closeCommandMenu();
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }

  function handleCommandMenuKeydown(event) {
    const menu = $('[data-testid="command-menu"]');
    if (!menu || menu.hidden || commandMenuState.input !== event.target) return false;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!commandMenuState.items.length) return true;
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      commandMenuState.activeIndex = commandMenuState.activeIndex < 0
        ? (direction > 0 ? 0 : commandMenuState.items.length - 1)
        : (commandMenuState.activeIndex + direction + commandMenuState.items.length) % commandMenuState.items.length;
      syncCommandMenuSelection();
      return true;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      selectCommandItem();
      return true;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeCommandMenu();
      return true;
    }
    return false;
  }

  const scheduledTaskPrompt = '描述一个想安排的定时任务吧。首先,说明已安排任务在页面中的工作方式。然后询问我需要安排什么,以及应该在什么时候运行。';

  function closeScheduledSelects(except = null) {
    $$('[data-scheduled-select]').forEach((root) => {
      if (root === except) return;
      const trigger = $('.scheduled-select-trigger', root);
      const menu = $('.scheduled-select-menu', root);
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (menu) menu.hidden = true;
    });
  }

  function scheduledTimeParts() {
    return [
      $('[data-testid="scheduled-time-hour"]').value.trim(),
      $('[data-testid="scheduled-time-minute"]').value.trim()
    ];
  }

  function scheduledTimePickerParts() {
    const [hour, minute] = scheduledTimeParts();
    return [
      /^(?:[01]\d|2[0-3])$/.test(hour) ? hour : '09',
      /^[0-5]\d$/.test(minute) ? minute : '00'
    ];
  }

  function setScheduledTime(hour, minute) {
    $('[data-testid="scheduled-time-hour"]').value = hour;
    $('[data-testid="scheduled-time-minute"]').value = minute;
  }

  function renderScheduledTimePicker() {
    const [hour, minute] = scheduledTimePickerParts();
    const hours = $('[data-scheduled-time-hours]');
    const minutes = $('[data-scheduled-time-minutes]');
    if (!hours.children.length) {
      hours.innerHTML = Array.from({ length: 24 }, (_, index) => {
        const value = String(index).padStart(2, '0');
        return `<button type="button" role="option" data-action="select-scheduled-time" data-scheduled-time-hour="${value}" aria-selected="false">${value}</button>`;
      }).join('');
      minutes.innerHTML = Array.from({ length: 12 }, (_, index) => {
        const value = String(index * 5).padStart(2, '0');
        return `<button type="button" role="option" data-action="select-scheduled-time" data-scheduled-time-minute="${value}" aria-selected="false">${value}</button>`;
      }).join('');
    }
    $$('[data-scheduled-time-hour]', hours).forEach((option) => {
      option.setAttribute('aria-selected', String(option.dataset.scheduledTimeHour === hour));
    });
    $$('[data-scheduled-time-minute]', minutes).forEach((option) => {
      option.setAttribute('aria-selected', String(option.dataset.scheduledTimeMinute === minute));
    });
  }

  function closeScheduledTimePicker() {
    const trigger = $('[data-testid="scheduled-time-trigger"]');
    const picker = $('[data-testid="scheduled-time-picker"]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (picker) picker.hidden = true;
  }

  function toggleScheduledTimePicker(trigger) {
    const picker = $('[data-testid="scheduled-time-picker"]');
    const willOpen = picker.hidden;
    closeTransientDropdowns();
    if (!willOpen) return;
    renderScheduledTimePicker();
    picker.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    $$('[role="option"][aria-selected="true"]', picker).forEach((option) => {
      const list = option.closest('[role="listbox"]');
      list.scrollTop = option.offsetTop - ((list.clientHeight - option.offsetHeight) / 2);
    });
  }

  function selectScheduledTimePart(option) {
    const [currentHour, currentMinute] = scheduledTimePickerParts();
    const hour = option.dataset.scheduledTimeHour ?? currentHour;
    const minute = option.dataset.scheduledTimeMinute ?? currentMinute;
    setScheduledTime(hour, minute);
    validateScheduledTime();
    renderScheduledTimePicker();
  }

  function toggleScheduledSelect(trigger) {
    const root = trigger.closest('[data-scheduled-select]');
    const menu = $('.scheduled-select-menu', root);
    const willOpen = menu.hidden;
    closeTransientDropdowns();
    if (willOpen) {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }
  }

  function setScheduledSelectValue(root, value) {
    if (!root) return;
    const option = $$('[data-scheduled-option]', root).find((item) => item.dataset.scheduledOption === value);
    if (!option) return;
    root.dataset.value = value;
    $('[data-scheduled-select-value]', root).textContent = option.textContent.trim();
    $$('[data-scheduled-option]', root).forEach((item) => {
      item.setAttribute('aria-selected', String(item === option));
    });
  }

  function selectScheduledOption(option) {
    const root = option.closest('[data-scheduled-select]');
    setScheduledSelectValue(root, option.dataset.scheduledOption);
    closeScheduledSelects();
  }

  function getScheduledSelectValue(name) {
    return $(`[data-scheduled-select="${name}"]`)?.dataset.value || '';
  }

  function scheduledTimeField(part) {
    const isHour = part === 'hour';
    return {
      input: $(`[data-testid="scheduled-time-${part}"]`),
      error: $(`[data-testid="scheduled-time-${part}-error"]`),
      max: isHour ? 23 : 59,
      emptyMessage: `${isHour ? '小时' : '分钟'}不能为空`,
      rangeMessage: `${isHour ? '小时请输入 00–23' : '分钟请输入 00–59'}`
    };
  }

  function setScheduledTimeFieldError(part, message = '') {
    const { input, error } = scheduledTimeField(part);
    input.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
    error.hidden = !message;
  }

  function validateScheduledTimeField(part, allowPartial = false) {
    const { input, max, emptyMessage, rangeMessage } = scheduledTimeField(part);
    const value = input.value.trim();
    if (!value) {
      setScheduledTimeFieldError(part, emptyMessage);
      return false;
    }
    const numeric = /^\d{1,2}$/.test(value) && Number(value) <= max;
    if (!numeric || (!allowPartial && value.length !== 2)) {
      setScheduledTimeFieldError(part, rangeMessage);
      return false;
    }
    setScheduledTimeFieldError(part);
    return true;
  }

  function validateScheduledTime() {
    const hourValid = validateScheduledTimeField('hour');
    const minuteValid = validateScheduledTimeField('minute');
    return hourValid && minuteValid;
  }

  function scheduledTimePartFromInput(input) {
    return input.matches('[data-testid="scheduled-time-hour"]') ? 'hour' : 'minute';
  }

  function handleScheduledTimeInput(event) {
    const input = event.target;
    if (event.isComposing || input.dataset.composing === 'true') return;
    const part = scheduledTimePartFromInput(input);
    input.value = input.value.replace(/\D/g, '').slice(0, 2);
    if (input.getAttribute('aria-invalid') === 'true') validateScheduledTimeField(part, true);
    if (part === 'hour' && input.value.length === 2) {
      $('[data-testid="scheduled-time-minute"]').focus();
    }
    if (!$('[data-testid="scheduled-time-picker"]').hidden) renderScheduledTimePicker();
  }

  function handleScheduledTimeBlur(event) {
    const input = event.target;
    if (input.dataset.composing === 'true') return;
    const part = scheduledTimePartFromInput(input);
    if (/^\d$/.test(input.value)) input.value = input.value.padStart(2, '0');
    validateScheduledTimeField(part);
    if (!$('[data-testid="scheduled-time-picker"]').hidden) renderScheduledTimePicker();
  }

  function handleScheduledTimeKeydown(event) {
    const minuteInput = $('[data-testid="scheduled-time-minute"]');
    if (event.isComposing || event.target !== minuteInput || event.key !== 'Backspace') return;
    if (minuteInput.value || minuteInput.selectionStart !== 0) return;
    event.preventDefault();
    const hourInput = $('[data-testid="scheduled-time-hour"]');
    hourInput.focus();
    hourInput.setSelectionRange(hourInput.value.length, hourInput.value.length);
  }

  function isScheduledTaskDeferred(task) {
    return task.repeat === '稍后安排';
  }

  function renderScheduledTasks() {
    const root = $('[data-testid="scheduled-task-list"]');
    const empty = $('[data-testid="scheduled-task-empty"]');
    if (!root || !empty) return;
    const query = $('[data-testid="scheduled-task-search"]').value.trim().toLowerCase();
    const tasks = state.scheduledTasks.filter((task) => task.title.toLowerCase().includes(query));
    root.innerHTML = tasks.map((task) => {
      const projectName = state.projects.get(task.projectId)?.name || '未分类项目';
      const deferred = isScheduledTaskDeferred(task);
      const active = task.active && !deferred;
      return `<article class="scheduled-task-card${active ? '' : ' is-paused'}" data-scheduled-task-id="${task.id}"><strong>${escapeHtml(task.title)}</strong><p>${escapeHtml(task.runTask || 'Agent')} · ${escapeHtml(projectName)}</p><small>${escapeHtml(task.repeat)} · ${escapeHtml(task.time)} · ${escapeHtml(task.notification)}</small><span class="scheduled-task-status">${deferred ? '待安排' : active ? '运行中' : '已暂停'}</span><div class="scheduled-task-actions"><button type="button" data-action="edit-scheduled-task">修改</button><button type="button" data-action="toggle-scheduled-task"${deferred ? ' disabled title="请先修改任务并选择其他重复频率"' : ''}>${active ? '暂停' : '开始'}</button></div></article>`;
    }).join('');
    empty.hidden = tasks.length > 0;
    empty.textContent = state.scheduledTasks.length && query ? '未找到匹配的已安排任务' : '未找到已安排任务';
  }

  function openScheduledTaskDrawer(taskId = null) {
    closeOverlays();
    const task = taskId ? state.scheduledTasks.find((item) => item.id === taskId) : null;
    state.scheduledTaskEditId = task?.id || null;
    const drawer = $('[data-testid="scheduled-task-drawer"]');
    drawer.hidden = false;
    $('[data-testid="scheduled-drawer-mode-title"]').textContent = task ? '修改' : '新建';
    $('[data-testid="scheduled-save-button"]').textContent = task ? '保存' : '创建';
    $('[data-testid="scheduled-task-title"]').value = task?.title || '';
    setScheduledSelectValue($('[data-scheduled-select="run-task"]'), task?.runTask === 'Agent' ? '' : task?.runTask || '');
    setScheduledSelectValue($('[data-scheduled-select="run-directory"]'), task?.projectId || '');
    setScheduledSelectValue($('[data-scheduled-select="repeat"]'), task?.repeat || '每天');
    setScheduledTime(...(task?.time || '09:00').split(':'));
    setScheduledSelectValue($('[data-scheduled-select="notification"]'), task?.notification || '重要更新');
    validateScheduledTime();
    closeScheduledSelects();
    closeScheduledTimePicker();
    $('[data-testid="scheduled-task-title"]').focus();
  }

  function closeScheduledTaskDrawer() {
    const drawer = $('[data-testid="scheduled-task-drawer"]');
    if (drawer) drawer.hidden = true;
    state.scheduledTaskEditId = null;
    closeScheduledSelects();
    closeScheduledTimePicker();
  }

  function createScheduledTaskFromChat() {
    closeOverlays();
    selectComposerProject(null);
    createConversation(scheduledTaskPrompt, {
      title: '配置定时任务',
      scheduledDraft: {
        status: 'configuring',
        title: '',
        runTask: 'Agent',
        projectId: 'unbound-project',
        repeat: '',
        time: '',
        notification: '重要更新',
        notificationChannel: '站内通知',
        taskId: null
      },
      followups: [{
        role: 'assistant',
        text: '正在配置定时任务。请描述任务内容、运行频率和时间；也可以补充运行目录与通知方式。'
      }]
    });
  }

  function scheduledDraftTitleFromMessage(message) {
    return message
      .replace(/(?:[01]?\d|2[0-3])[：:][0-5]\d/g, ' ')
      .replace(/(?:每天|每日|每周[一二三四五六日天]?|每月\d{0,2}[日号]?)/g, ' ')
      .replace(/(?:并)?(?:通过)?(?:站内|邮件)(?:通知)?(?:我)?/g, ' ')
      .replace(/(?:请|帮我|定时|运行)/g, ' ')
      .replace(/[，,。；;：:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function parseScheduledDraftMessage(draft, message) {
    const timeMatch = message.match(/(?:^|\D)([01]?\d|2[0-3])[：:]([0-5]\d)(?:\D|$)/);
    if (timeMatch) draft.time = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;

    const weeklyMatch = message.match(/每周([一二三四五六日天])?/);
    const monthlyMatch = message.match(/每月(\d{1,2})?[日号]?/);
    if (/每天|每日/.test(message)) draft.repeat = '每天';
    else if (weeklyMatch) draft.repeat = `每周${weeklyMatch[1] === '天' ? '日' : weeklyMatch[1] || ''}`;
    else if (monthlyMatch) draft.repeat = monthlyMatch[1] ? `每月${monthlyMatch[1]}日` : '每月';

    const project = [...state.projects.values()].find((item) => item.id !== 'unbound-project' && message.includes(item.name));
    if (project) draft.projectId = project.id;
    if (message.includes('邮件')) draft.notificationChannel = '邮件通知';
    if (message.includes('全部更新')) draft.notification = '全部更新';
    if (message.includes('不通知')) draft.notification = '不通知';

    const title = scheduledDraftTitleFromMessage(message);
    if (!draft.title && title.length >= 2) draft.title = title;
    return [
      !draft.title ? '任务内容' : '',
      !draft.repeat ? '运行频率' : '',
      !draft.time ? '运行时间' : ''
    ].filter(Boolean);
  }

  function processScheduledDraftMessage(projectId, conversation, message) {
    const draft = conversation.scheduledDraft;
    conversation.pendingFollowup = null;
    const missing = parseScheduledDraftMessage(draft, message);
    conversation.followups = conversation.followups.filter((entry) => entry.type !== 'scheduled-confirmation');
    if (missing.length) {
      draft.status = 'configuring';
      conversation.followups.push({
        role: 'assistant',
        text: `已记录当前信息，还需要补充：${missing.join('、')}。`
      });
    } else {
      draft.status = 'ready';
      conversation.followups.push({ role: 'assistant', type: 'scheduled-confirmation' });
    }
    conversation.status = 'complete';
    conversation.unread = false;
    syncSidebarConversation(projectId, conversation);
  }

  function confirmScheduledTaskFromConversation() {
    const view = $('[data-testid="conversation-view"]');
    const projectId = view.dataset.projectId;
    const conversation = getConversation(projectId, view.dataset.conversationId);
    const draft = conversation?.scheduledDraft;
    if (!conversation || !draft || draft.status !== 'ready' || draft.taskId) return;
    if (draft.projectId === 'unbound-project') ensureUnboundProject();
    const task = {
      id: `scheduled-task-${++state.scheduledTaskSequence}`,
      title: draft.title,
      runTask: draft.runTask,
      projectId: draft.projectId,
      repeat: draft.repeat,
      time: draft.time,
      notification: draft.notification,
      notificationChannel: draft.notificationChannel,
      active: !isScheduledTaskDeferred(draft),
      sourceConversationId: conversation.id
    };
    state.scheduledTasks.unshift(task);
    draft.status = 'confirmed';
    draft.taskId = task.id;
    conversation.title = draft.title;
    conversation.followups = conversation.followups.filter((entry) => entry.type !== 'scheduled-confirmation');
    conversation.followups.push({ role: 'assistant', type: 'scheduled-created' });
    syncSidebarConversation(projectId, conversation);
    renderConversationFollowups(conversation);
    renderScheduledConversationStatus(conversation);
    renderScheduledTasks();
    showToast('定时任务已创建');
  }

  function saveScheduledTask() {
    const title = $('[data-testid="scheduled-task-title"]').value.trim();
    if (!title) return showToast('请输入已安排任务标题');
    if (!validateScheduledTime()) {
      $('[aria-invalid="true"]', $('[data-testid="scheduled-task-drawer"]'))?.focus();
      return showToast('请输入有效的任务时间');
    }
    const [hour, minute] = scheduledTimeParts();
    const values = {
      title,
      runTask: getScheduledSelectValue('run-task') || 'Agent',
      projectId: getScheduledSelectValue('run-directory') || 'unbound-project',
      repeat: getScheduledSelectValue('repeat'),
      time: `${hour}:${minute}`,
      notification: getScheduledSelectValue('notification')
    };
    if (values.projectId === 'unbound-project') ensureUnboundProject();
    const existing = state.scheduledTasks.find((item) => item.id === state.scheduledTaskEditId);
    if (existing) {
      Object.assign(existing, values);
      if (isScheduledTaskDeferred(existing)) existing.active = false;
    }
    else {
      state.scheduledTasks.unshift({
        id: `scheduled-task-${++state.scheduledTaskSequence}`,
        ...values,
        active: !isScheduledTaskDeferred(values)
      });
    }
    closeScheduledTaskDrawer();
    renderScheduledTasks();
    showToast(existing ? `已更新定时任务「${title}」` : `已创建定时任务「${title}」`);
  }

  function editScheduledTask(button) {
    const card = button.closest('[data-scheduled-task-id]');
    if (!card) return;
    openScheduledTaskDrawer(card.dataset.scheduledTaskId);
  }

  function toggleScheduledTask(button) {
    const card = button.closest('[data-scheduled-task-id]');
    const task = state.scheduledTasks.find((item) => item.id === card?.dataset.scheduledTaskId);
    if (!task) return;
    if (isScheduledTaskDeferred(task)) return showToast('请先修改任务并选择其他重复频率');
    task.active = !task.active;
    renderScheduledTasks();
    showToast(task.active ? '定时任务已开始' : '定时任务已暂停');
  }

  function activateNav(button) {
    setView(button.dataset.nav);
  }

  function selectSkillTab(id) {
    $$('[data-skill-tab]').forEach((tab) => {
      const selected = tab.dataset.skillTab === id;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    $$('[data-skill-panel]').forEach((panel) => { panel.hidden = panel.dataset.skillPanel !== id; });
    $('[data-testid="skill-categories"]').hidden = id !== 'plaza';
  }

  function selectCapabilityTab(id) {
    state.capability = id;
    $$('[data-capability-tab]').forEach((tab) => {
      const selected = tab.dataset.capabilityTab === id;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    $$('[data-capability-panel]').forEach((panel) => { panel.hidden = panel.dataset.capabilityPanel !== id; });
  }

  function filterSkills() {
    const query = $('[data-testid="skill-search"]').value.trim().toLowerCase();
    let visibleCount = 0;
    $$('[data-skill-card]').forEach((card) => {
      const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
      const categories = card.dataset.skillCategories.split(/\s+/);
      const matchesCategory = state.skillCategory === 'all' || categories.includes(state.skillCategory);
      card.hidden = !(matchesQuery && matchesCategory);
      if (!card.hidden) visibleCount += 1;
    });
    $('[data-testid="skill-empty-results"]').hidden = visibleCount !== 0;
  }

  function selectSkillCategory(id) {
    state.skillCategory = id;
    $$('[data-skill-category]').forEach((tab) => {
      const selected = tab.dataset.skillCategory === id;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    filterSkills();
  }

  function filterComposerSkills() {
    const query = $('[data-testid="composer-skill-search"]').value.trim().toLowerCase();
    let visibleCount = 0;
    $$('[data-composer-skill-item]').forEach((item) => {
      const categories = item.dataset.composerSkillCategories.split(/\s+/);
      const isMine = item.dataset.composerSkillSource === 'mine';
      const categoryMatches = state.composerSkillCategory === 'mine'
        ? isMine
        : !isMine && (state.composerSkillCategory === 'all' || categories.includes(state.composerSkillCategory));
      const queryMatches = !query || item.textContent.toLowerCase().includes(query);
      item.hidden = !(categoryMatches && queryMatches);
      if (!item.hidden) visibleCount += 1;
    });
    $('[data-composer-skill-empty]').hidden = visibleCount !== 0;
  }

  function selectComposerSkillCategory(id) {
    state.composerSkillCategory = id;
    $$('[data-composer-skill-category]').forEach((tab) => {
      const selected = tab.dataset.composerSkillCategory === id;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    filterComposerSkills();
  }

  function renderComposerSkills() {
    const root = $('[data-composer-skill-results]');
    const skills = $$('[data-skill-card]').map((card) => ({
      name: $('h2', card).textContent.trim(),
      categories: card.dataset.composerSkillCategories || '',
      source: 'plaza'
    }));
    state.installedSkills.forEach((name) => skills.push({ name, categories: 'mine', source: 'mine' }));
    const items = skills.map(({ name, categories, source }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('role', 'menuitem');
      button.dataset.skill = name;
      button.dataset.composerSkillItem = '';
      button.dataset.composerSkillCategories = categories;
      button.dataset.composerSkillSource = source;
      const glyph = document.createElement('span');
      glyph.textContent = name.replace(/\s+/g, '').slice(0, 1).toUpperCase();
      const label = document.createElement('strong');
      label.textContent = name;
      button.append(glyph, label);
      return button;
    });
    const empty = document.createElement('p');
    empty.dataset.composerSkillEmpty = '';
    empty.textContent = '没有找到匹配的 Skill';
    root.replaceChildren(...items, empty);
    filterComposerSkills();
  }

  const knowledgeOriginalFiles = new WeakMap();

  function updateKnowledgeSelectionState() {
    const visibleChecks = $$('[data-knowledge-row]:not([hidden]) [data-knowledge-select]');
    const selectedCount = visibleChecks.filter((check) => check.checked).length;
    const selectAll = $('[data-testid="knowledge-select-all"]');
    const importSelected = $('[data-testid="knowledge-import-selected"]');
    selectAll.checked = visibleChecks.length > 0 && selectedCount === visibleChecks.length;
    selectAll.indeterminate = selectedCount > 0 && selectedCount < visibleChecks.length;
    importSelected.hidden = selectedCount === 0 || state.knowledgeFilter === 'trash';
    importSelected.setAttribute('aria-label', selectedCount ? `导入 ${selectedCount} 个选中文档到对话` : '导入选中文档到对话');
  }

  function importKnowledgeRows(rows) {
    rows = rows.filter((row) => row.dataset.trashed !== 'true');
    const names = rows.map((row) => row.dataset.name).filter(Boolean);
    if (!names.length) return showToast('请先选择文档');
    setView('create');
    rows.forEach((row) => {
      if (row.dataset.name) addComposerReference('home', 'knowledge', row.dataset.name, 'knowledge', 'picker', knowledgeReferenceOrigin(row));
    });
    setPrompt(`请基于${names.map((name) => `「${name}」`).join('、')}中的内容完成：`);
    return showToast(names.length === 1 ? `已将「${names[0]}」带入对话` : `已将 ${names.length} 个资料库文档带入对话`);
  }

  document.addEventListener('script-library:import', (event) => {
    const scripts = (event.detail?.scripts || []).filter((item) => item && item.id && item.name);
    if (!scripts.length) return;
    setView('create');
    scripts.forEach((item) => addComposerReference('home', 'script', item.name, 'script', 'picker', `${item.scope || 'public'}:${item.id}`));
    setPrompt(`请参考${scripts.map((item) => `「${item.name}」`).join('、')}完成：`);
    showToast(scripts.length === 1 ? `已将「${scripts[0].name}」带入对话` : `已将 ${scripts.length} 个脚本带入对话`);
  });

  document.addEventListener('script-library:notify', (event) => {
    if (typeof event.detail?.message === 'string' && event.detail.message) showToast(event.detail.message);
  });

  function updateKnowledgeDirectoryCounts() {
    const rows = $$('[data-knowledge-row]').filter((row) => (row.dataset.space || 'public') === state.knowledgeSpace && row.dataset.trashed !== 'true');
    $$('[data-knowledge-directory]').forEach((button) => {
      const scope = button.dataset.knowledgeSpaceScope;
      if (scope && scope !== state.knowledgeSpace) return;
      const id = button.dataset.knowledgeDirectory;
      const count = id === 'all' ? rows.length : rows.filter((row) => row.dataset.knowledgeDirectoryId === id).length;
      const label = $('em', button);
      if (label) label.textContent = String(count).padStart(2, '0');
    });
  }

  function renderKnowledgeDirectoryList() {
    const root = $('[data-testid="knowledge-public-directory-list"]');
    if (!root) return;
    root.innerHTML = '';
    state.knowledgeDirectories.forEach((directory) => {
      if (directory.space !== 'public') return;
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.knowledgeDirectory = directory.id;
      button.dataset.knowledgeSpaceScope = directory.space;
      button.dataset.testid = directory.id;
      button.classList.toggle('active', directory.id === state.knowledgeDirectoryId);
      button.innerHTML = `${knowledgeFolderIcon()}<span>${escapeHtml(directory.name)}</span><em>00</em>`;
      root.append(button);
    });
    updateKnowledgeDirectoryCounts();
  }

  function renderKnowledgeProjectFilterOptions() {
    const filter = $('[data-testid="knowledge-project-filter"]');
    const list = $(`[data-testid="knowledge-${state.knowledgeSpace === 'private' ? 'private' : 'public'}-directory-list"]`);
    filter.replaceChildren(new Option('全部项目', 'all'));
    $$('[data-knowledge-directory]', list).forEach((button) => {
      if (button.dataset.knowledgeDirectory === 'all') return;
      filter.add(new Option($('span', button).textContent.trim(), button.dataset.knowledgeDirectory));
    });
    filter.value = filter.querySelector(`option[value="${state.knowledgeDirectoryId}"]`)
      ? state.knowledgeDirectoryId
      : 'all';
  }

  function filterKnowledgeDocuments() {
    const query = $('[data-testid="knowledge-search"]').value.trim().toLowerCase();
    let visibleCount = 0;
    $$('[data-knowledge-row]').forEach((row) => {
      const matchesSpace = (row.dataset.space || 'public') === state.knowledgeSpace;
      const matchesFilter = (row.dataset.trashed === 'true') === (state.knowledgeFilter === 'trash');
      const matchesDirectory = state.knowledgeDirectoryId === 'all'
        || row.dataset.knowledgeDirectoryId === state.knowledgeDirectoryId;
      const matchesQuery = !query || row.textContent.toLowerCase().includes(query);
      row.hidden = !(matchesSpace && matchesFilter && matchesDirectory && matchesQuery);
      $('.knowledge-row-menu', row).hidden = row.dataset.trashed === 'true';
      if (!row.hidden) visibleCount += 1;
    });
    $('[data-knowledge-visible-count]').textContent = String(visibleCount);
    $('[data-testid="knowledge-empty"]').hidden = visibleCount !== 0;
    updateKnowledgeSelectionState();
  }

  function canCreateKnowledgeFolder() {
    return state.knowledgeSpace !== 'public' || state.knowledgeRole === 'admin';
  }

  function updateKnowledgeFolderPermission() {
    const button = $('[data-testid="knowledge-new-folder"]');
    const control = $('[data-testid="knowledge-folder-permission"]');
    const restricted = !canCreateKnowledgeFolder();
    button.disabled = restricted;
    control.hidden = restricted;
  }

  function selectKnowledgeSpace(id) {
    closeKnowledgeMenu();
    closeKnowledgeItemDialog(false);
    state.knowledgeSpace = id;
    state.knowledgeFilter = 'all';
    const isPrivate = id === 'private';
    const title = isPrivate ? '我的个人空间' : '项目公共空间';
    const description = isPrivate ? '仅自己可见，用于整理个人资料、灵感与未发布内容' : '项目成员在同一目录下查找、预览与协作文档';
    $$('[data-knowledge-space]').forEach((button) => {
      const selected = button.dataset.knowledgeSpace === id;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    $('[data-testid="knowledge-documents"]').setAttribute('aria-labelledby', id === 'private' ? `knowledge-space-tab-private knowledge-filter-tab-all` : 'knowledge-space-tab-public');
    $('[data-testid="knowledge-filter-all"]').classList.add('active');
    $('[data-testid="knowledge-filter-all"]').setAttribute('aria-selected', 'true');
    $('[data-testid="knowledge-filter-all"]').tabIndex = 0;
    $('[data-testid="knowledge-recycle-bin"]').classList.remove('active');
    $('[data-testid="knowledge-recycle-bin"]').setAttribute('aria-selected', 'false');
    $('[data-testid="knowledge-recycle-bin"]').tabIndex = -1;
    $('.knowledge-filter-tabs').hidden = !isPrivate;
    $('[data-testid="knowledge-public-directory-list"]').hidden = isPrivate;
    $('[data-testid="knowledge-private-directory-list"]').hidden = !isPrivate;
    $('[data-knowledge-space-title]').textContent = title;
    $('[data-knowledge-space-description]').textContent = description;
    updateKnowledgeFolderPermission();
    $('[data-testid="knowledge-search"]').value = '';
    if (!isPrivate) renderKnowledgeDirectoryList();
    renderKnowledgeProjectFilterOptions();
    selectKnowledgeDirectory('all');
    updateKnowledgeDirectoryCounts();
  }

  function selectKnowledgeDirectory(id) {
    if (!id) return;
    state.knowledgeDirectoryId = id;
    $$('[data-knowledge-directory]').forEach((button) => button.classList.toggle('active', button.dataset.knowledgeDirectory === id));
    $('[data-testid="knowledge-project-filter"]').value = id;
    filterKnowledgeDocuments();
  }

  function selectKnowledgeFilter(id) {
    if (state.knowledgeSpace !== 'private' || !['all', 'trash'].includes(id)) return;
    closeKnowledgeMenu();
    state.knowledgeFilter = id;
    $$('[data-knowledge-filter]').forEach((button) => {
      const selected = button.dataset.knowledgeFilter === id;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    $('[data-testid="knowledge-documents"]').setAttribute('aria-labelledby', `knowledge-space-tab-private knowledge-filter-tab-${id}`);
    filterKnowledgeDocuments();
  }

  function sortKnowledgeDocuments(id) {
    state.knowledgeSort = id;
    $$('[data-knowledge-sort]').forEach((button) => {
      const selected = button.dataset.knowledgeSort === id;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const root = $('[data-knowledge-table-body]');
    const rows = $$('[data-knowledge-row]');
    const collator = new Intl.Collator('zh-CN', { numeric: true });
    rows.sort((a, b) => id === 'name'
      ? collator.compare(a.dataset.name, b.dataset.name)
      : Number(b.dataset.updated) - Number(a.dataset.updated));
    rows.forEach((row) => root.append(row));
    filterKnowledgeDocuments();
  }

  function setKnowledgeView(id) {
    state.knowledgeView = id;
    $('[data-testid="knowledge-documents"]').classList.toggle('is-grid-view', id === 'grid');
    $$('[data-knowledge-view]').forEach((button) => {
      const selected = button.dataset.knowledgeView === id;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function ensureKnowledgeDetailTrigger(row) {
    const label = $('.knowledge-file strong', row);
    if (!label) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'knowledge-detail-trigger';
    button.dataset.action = 'open-knowledge-detail';
    button.setAttribute('aria-label', `查看 ${row.dataset.name} 详情`);
    button.textContent = label.textContent;
    label.replaceWith(button);
  }

  function ensureKnowledgeRowActions(row) {
    if ($('.knowledge-row-actions', row)) return;
    const arrow = $('.knowledge-row-menu', row);
    if (!arrow) return;
    const actions = document.createElement('div');
    actions.className = 'knowledge-row-actions';
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'knowledge-row-more';
    more.dataset.action = 'toggle-knowledge-row-menu';
    more.setAttribute('aria-label', `${row.dataset.name} 的更多操作`);
    more.setAttribute('aria-haspopup', 'menu');
    more.setAttribute('aria-expanded', 'false');
    more.textContent = '···';
    arrow.replaceWith(actions);
    actions.append(more, arrow);
  }

  function closeKnowledgeMenu(restoreFocus = false) {
    $('[data-testid="knowledge-row-dropdown"]')?.remove();
    const trigger = state.knowledgeMenuTrigger;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    state.knowledgeMenuRow = null;
    state.knowledgeMenuTrigger = null;
    if (restoreFocus && trigger?.isConnected) trigger.focus();
  }

  function toggleKnowledgeRowMenu(row) {
    if (!row || row.hidden) return;
    const trigger = $('.knowledge-row-more', row);
    if (state.knowledgeMenuRow === row) return closeKnowledgeMenu(true);
    closeKnowledgeMenu();
    const trashed = row.dataset.trashed === 'true';
    const actions = trashed ? [['restore', '恢复文档']] : row.dataset.space === 'private'
      ? [['download', '下载'], ['version', '上传新版本'], ['rename', '重命名'], ['share', '分享到项目空间'], ['move', '移动到文件夹'], ['trash', '移入回收站']]
      : [['download', '下载'], ['version', '上传新版本'], ['rename', '重命名'], ['backup', '备份到个人空间']];
    const menu = document.createElement('div');
    menu.dataset.testid = 'knowledge-row-dropdown';
    menu.className = 'knowledge-row-dropdown';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', `${row.dataset.name} 的更多操作`);
    actions.forEach(([operation, label]) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.dataset.action = 'knowledge-row-operation';
      item.dataset.knowledgeOperation = operation;
      item.setAttribute('role', 'menuitem');
      item.textContent = label;
      menu.append(item);
    });
    document.body.append(menu);
    const anchor = trigger.getBoundingClientRect();
    const bounds = menu.getBoundingClientRect();
    const left = Math.max(8, Math.min(anchor.right - bounds.width, window.innerWidth - bounds.width - 8));
    const bottomTop = anchor.bottom + 5;
    const top = bottomTop + bounds.height > window.innerHeight - 8
      ? Math.max(8, anchor.top - bounds.height - 5)
      : bottomTop;
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    trigger.setAttribute('aria-expanded', 'true');
    state.knowledgeMenuRow = row;
    state.knowledgeMenuTrigger = trigger;
    $('button', menu).focus();
  }

  function knowledgeDirectoryName(id) {
    return state.knowledgeDirectories.get(id)?.name
      || $(`[data-knowledge-directory="${id}"] span`)?.textContent.trim()
      || '当前文件夹';
  }

  function updateKnowledgeRowName(row, name) {
    row.dataset.name = name;
    const title = $('.knowledge-detail-trigger', row);
    title.textContent = name;
    title.setAttribute('aria-label', `查看 ${name} 详情`);
    $('[data-knowledge-select]', row).setAttribute('aria-label', `选择 ${name}`);
    $('.knowledge-row-more', row).setAttribute('aria-label', `${name} 的更多操作`);
    $('.knowledge-row-menu', row).setAttribute('aria-label', `导入 ${name} 到对话`);
  }

  function uniqueKnowledgeCopyName(name, space, directory) {
    const existing = (candidate) => $$('[data-knowledge-row]').some((row) => row.dataset.name === candidate
      && row.dataset.space === space && row.dataset.knowledgeDirectoryId === directory
      && row.dataset.trashed !== 'true');
    if (!existing(name)) return name;
    const dot = name.lastIndexOf('.');
    const stem = dot > 0 ? name.slice(0, dot) : name;
    const extension = dot > 0 ? name.slice(dot) : '';
    let copy = 2;
    while (existing(`${stem} (${copy})${extension}`)) copy += 1;
    return `${stem} (${copy})${extension}`;
  }

  function cloneKnowledgeDocument(row, space, directory) {
    const clone = row.cloneNode(true);
    clone.classList.remove('active');
    clone.hidden = false;
    clone.dataset.space = space;
    clone.dataset.knowledgeDirectoryId = directory;
    delete clone.dataset.trashed;
    clone.dataset.updated = String(++state.knowledgeDocumentSequence);
    $('[data-knowledge-select]', clone).checked = false;
    $('.knowledge-directory-cell', clone).textContent = knowledgeDirectoryName(directory);
    $('.knowledge-owner-column', clone).textContent = '我';
    const updated = $('.knowledge-updated-cell', clone);
    const updatedLabel = [...updated.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (updatedLabel) updatedLabel.textContent = '刚刚';
    else updated.prepend(document.createTextNode('刚刚'));
    updateKnowledgeRowName(clone, uniqueKnowledgeCopyName(row.dataset.name, space, directory));
    const original = knowledgeOriginalFiles.get(row);
    if (original) knowledgeOriginalFiles.set(clone, original);
    $('[data-knowledge-table-body]').prepend(clone);
    updateKnowledgeDirectoryCounts();
    filterKnowledgeDocuments();
    return clone;
  }

  function openKnowledgeItemDialog(action, row) {
    const dialog = $('[data-testid="knowledge-item-dialog"]');
    state.knowledgeItemAction = action;
    state.knowledgeItemRow = row;
    state.knowledgeItemReturnTarget = $('.knowledge-row-more', row);
    const nameField = $('[data-knowledge-item-name-field]', dialog);
    const folderField = $('[data-knowledge-item-folder-field]', dialog);
    const title = $('[data-knowledge-item-dialog-title]', dialog);
    const submit = $('[data-testid="knowledge-item-submit"]', dialog);
    nameField.hidden = action !== 'rename';
    folderField.hidden = action === 'rename';
    if (action === 'rename') {
      title.textContent = '重命名文档';
      submit.textContent = '保存';
      $('[data-testid="knowledge-item-name"]', dialog).value = row.dataset.name;
    } else {
      const publicSpace = action === 'share';
      title.textContent = publicSpace ? '分享到项目空间' : '移动到文件夹';
      submit.textContent = publicSpace ? '分享' : '移动';
      const folders = publicSpace
        ? $$('[data-knowledge-directory]', $('[data-testid="knowledge-public-directory-list"]'))
          .map((button) => ({ id: button.dataset.knowledgeDirectory, name: $('span', button).textContent.trim() }))
        : $$('[data-knowledge-directory]', $('[data-testid="knowledge-private-directory-list"]'))
          .filter((button) => button.dataset.knowledgeDirectory !== 'all')
          .map((button) => ({ id: button.dataset.knowledgeDirectory, name: $('span', button).textContent.trim() }));
      const select = $('[data-testid="knowledge-item-folder"]', dialog);
      select.replaceChildren(
        ...(publicSpace && folders.length > 1 ? [new Option('请选择目标项目', '')] : []),
        ...folders.map((folder) => new Option(folder.name, folder.id))
      );
      if (publicSpace && folders.length > 1) select.value = '';
      if (!folders.length) {
        state.knowledgeItemAction = null;
        return showToast('没有可用的目标文件夹');
      }
      if (!publicSpace && folders.some((folder) => folder.id === row.dataset.knowledgeDirectoryId)) {
        select.value = row.dataset.knowledgeDirectoryId;
      }
    }
    dialog.hidden = false;
    (action === 'rename' ? $('[data-testid="knowledge-item-name"]', dialog) : $('[data-testid="knowledge-item-folder"]', dialog)).focus();
  }

  function closeKnowledgeItemDialog(restoreFocus = true) {
    const dialog = $('[data-testid="knowledge-item-dialog"]');
    if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    if (restoreFocus && state.knowledgeItemReturnTarget?.isConnected && !state.knowledgeItemRow?.hidden) state.knowledgeItemReturnTarget.focus();
    state.knowledgeItemAction = null;
    state.knowledgeItemRow = null;
    state.knowledgeItemReturnTarget = null;
  }

  function submitKnowledgeItemDialog() {
    const action = state.knowledgeItemAction;
    const row = state.knowledgeItemRow;
    if (!row) return;
    if (action === 'rename') {
      const name = $('[data-testid="knowledge-item-name"]').value.trim();
      if (!name) return showToast('请输入文档名称');
      updateKnowledgeRowName(row, name);
      closeKnowledgeItemDialog();
      filterKnowledgeDocuments();
      return showToast(`已重命名为「${name}」`);
    }
    const directory = $('[data-testid="knowledge-item-folder"]').value;
    if (!directory) return showToast('请选择目标文件夹');
    if (action === 'share') {
      const copy = cloneKnowledgeDocument(row, 'public', directory);
      closeKnowledgeItemDialog();
      return showToast(`已将「${copy.dataset.name}」分享到项目空间`);
    }
    if (action === 'move') {
      row.dataset.knowledgeDirectoryId = directory;
      $('.knowledge-directory-cell', row).textContent = knowledgeDirectoryName(directory);
      closeKnowledgeItemDialog(false);
      updateKnowledgeDirectoryCounts();
      filterKnowledgeDocuments();
      return showToast(`已移动到「${knowledgeDirectoryName(directory)}」`);
    }
  }

  function downloadKnowledgeDocument(row) {
    const file = knowledgeOriginalFiles.get(row);
    if (!file) return showToast('暂无可下载的原始文件');
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = row.dataset.name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function operateKnowledgeRow(target) {
    const row = state.knowledgeMenuRow;
    const operation = target.dataset.knowledgeOperation;
    if (!row) return;
    closeKnowledgeMenu();
    if (operation === 'download') return downloadKnowledgeDocument(row);
    if (operation === 'version') {
      state.knowledgeVersionRow = row;
      const input = $('[data-testid="knowledge-version-file-input"]');
      input.value = '';
      return input.click();
    }
    if (['rename', 'share', 'move'].includes(operation)) return openKnowledgeItemDialog(operation, row);
    if (operation === 'backup') {
      const copy = cloneKnowledgeDocument(row, 'private', 'notes');
      return showToast(`已将「${copy.dataset.name}」备份到个人空间`);
    }
    if (operation === 'trash' || operation === 'restore') {
      row.dataset.trashed = operation === 'trash' ? 'true' : 'false';
      $('[data-knowledge-select]', row).checked = false;
      updateKnowledgeDirectoryCounts();
      filterKnowledgeDocuments();
      $('[data-knowledge-filter="' + state.knowledgeFilter + '"]')?.focus();
      return showToast(operation === 'trash' ? '已移入回收站' : '已恢复文档');
    }
  }

  function openKnowledgeDetail(row) {
    if (!row || row.hidden) return;
    $$('[data-knowledge-row]').forEach((item) => item.classList.toggle('active', item === row));
    const dialog = $('[data-testid="knowledge-detail-dialog"]');
    const updated = $('.knowledge-updated-cell', row);
    state.knowledgeDetailReturnTarget = $('.knowledge-detail-trigger', row);
    $('[data-knowledge-detail-title]', dialog).textContent = row.dataset.name || '';
    $('[data-knowledge-detail-type]', dialog).textContent = $('.knowledge-file-type', row)?.textContent.trim() || '—';
    $('[data-knowledge-detail-directory]', dialog).textContent = $('.knowledge-directory-cell', row)?.textContent.trim() || '—';
    $('[data-knowledge-detail-owner]', dialog).textContent = $('.knowledge-owner-column', row)?.textContent.trim() || '—';
    $('[data-knowledge-detail-updated]', dialog).textContent = updated?.firstChild?.textContent.trim() || '—';
    $('[data-knowledge-detail-status]', dialog).textContent = $('small', updated)?.textContent.trim() || '—';
    $('[data-knowledge-detail-summary]', dialog).textContent = $('.knowledge-file small', row)?.textContent.trim() || '—';
    dialog.hidden = false;
    $('[data-action="close-knowledge-detail"]', dialog).focus();
  }

  function closeKnowledgeDetail(restoreFocus = true) {
    const dialog = $('[data-testid="knowledge-detail-dialog"]');
    if (dialog.hidden) return;
    dialog.hidden = true;
    if (restoreFocus && state.knowledgeDetailReturnTarget?.isConnected) state.knowledgeDetailReturnTarget.focus();
    state.knowledgeDetailReturnTarget = null;
  }

  function openKnowledgeDialog(mode) {
    clearTimeout(state.knowledgeOnlineImportTimer);
    state.knowledgeOnlineImportTimer = null;
    state.knowledgeDialogMode = mode;
    const isFolder = mode === 'folder';
    const dialog = $('[data-testid="knowledge-dialog"]');
    const panel = $('.knowledge-action-dialog', dialog);
    panel.classList.toggle('is-content', !isFolder);
    $('[data-knowledge-dialog-title]').textContent = isFolder ? '新建文件夹' : '添加内容';
    const subtitle = $('[data-knowledge-dialog-subtitle]');
    subtitle.textContent = `添加到${state.knowledgeSpace === 'private' ? '我的个人空间' : '项目公共空间'}`;
    subtitle.hidden = isFolder;
    $('[data-knowledge-folder-form]').hidden = !isFolder;
    $('[data-knowledge-content-chooser]').hidden = isFolder;
    $('[data-knowledge-online-form]').hidden = true;
    $('[data-knowledge-dialog-label]').textContent = isFolder ? '文件夹名称' : '内容名称';
    $('[data-knowledge-dialog-note]').textContent = isFolder
      ? '文件夹会创建在当前知识空间中。'
      : '内容会添加到当前目录，并进入解析与检索流程。';
    $('[data-testid="knowledge-dialog-submit"]').textContent = isFolder ? '创建' : '添加';
    const input = $('[data-testid="knowledge-dialog-input"]');
    input.value = '';
    input.placeholder = isFolder ? '例如：灵感草稿' : '例如：竞品分析.md';
    dialog.hidden = false;
    resetKnowledgeOnlineForm();
    if (isFolder) setTimeout(() => input.focus(), 0);
  }

  function closeKnowledgeDialog() {
    clearTimeout(state.knowledgeOnlineImportTimer);
    state.knowledgeOnlineImportTimer = null;
    $('[data-testid="knowledge-dialog"]').hidden = true;
    state.knowledgeDialogMode = null;
    $('[data-testid="knowledge-dialog-input"]').value = '';
    $('[data-testid="knowledge-local-file-input"]').value = '';
    resetKnowledgeOnlineForm();
  }

  function resetKnowledgeOnlineForm() {
    const input = $('[data-testid="knowledge-online-url"]');
    const error = $('[data-testid="knowledge-online-error"]');
    const submit = $('[data-testid="knowledge-online-submit"]');
    input.value = '';
    input.setAttribute('aria-invalid', 'false');
    error.textContent = '';
    error.hidden = true;
    submit.disabled = false;
    submit.textContent = '验证并导入';
  }

  function currentKnowledgeLocationLabel() {
    const directory = state.knowledgeDirectoryId === 'all'
      ? '全部文档'
      : state.knowledgeDirectories.get(state.knowledgeDirectoryId)?.name
        || $(`[data-knowledge-directory="${state.knowledgeDirectoryId}"] span`)?.textContent
        || '当前目录';
    return `${state.knowledgeSpace === 'public' ? '项目公共空间' : '我的个人空间'} / ${directory}`;
  }

  function openKnowledgeOnlineLinkForm() {
    state.knowledgeDialogMode = 'online-link';
    $('[data-knowledge-content-chooser]').hidden = true;
    $('[data-knowledge-online-form]').hidden = false;
    $('[data-knowledge-dialog-title]').textContent = '导入普通在线文档';
    const subtitle = $('[data-knowledge-dialog-subtitle]');
    subtitle.textContent = '创建一次安全快照，并保留原始链接和导入时间';
    subtitle.hidden = false;
    const option = $('[data-knowledge-online-location-option]');
    option.value = `${state.knowledgeSpace}:${state.knowledgeDirectoryId}`;
    option.textContent = currentKnowledgeLocationLabel();
    setTimeout(() => $('[data-testid="knowledge-online-url"]').focus(), 0);
  }

  function showKnowledgeOnlineError(message) {
    const input = $('[data-testid="knowledge-online-url"]');
    const error = $('[data-testid="knowledge-online-error"]');
    input.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    error.hidden = false;
    input.focus();
  }

  function submitKnowledgeOnlineLink() {
    const input = $('[data-testid="knowledge-online-url"]');
    const value = input.value.trim();
    if (!value) return showKnowledgeOnlineError('请输入在线文档链接');
    let url;
    try {
      url = new URL(value);
    } catch (error) {
      return showKnowledgeOnlineError('请输入 http:// 或 https:// 开头的有效链接');
    }
    if (!['http:', 'https:'].includes(url.protocol)) {
      return showKnowledgeOnlineError('请输入 http:// 或 https:// 开头的有效链接');
    }
    const error = $('[data-testid="knowledge-online-error"]');
    const submit = $('[data-testid="knowledge-online-submit"]');
    input.setAttribute('aria-invalid', 'false');
    error.hidden = true;
    submit.disabled = true;
    submit.textContent = '验证中…';
    state.knowledgeOnlineImportTimer = setTimeout(() => {
      state.knowledgeOnlineImportTimer = null;
      const row = createKnowledgeDocument('在线文档');
      row.dataset.sourceUrl = url.href;
      row.dataset.importedAt = new Date().toISOString();
      const type = $('.knowledge-file-type', row);
      const summary = $('.knowledge-file small', row);
      if (type) type.textContent = 'LINK';
      if (summary) {
        summary.textContent = '在线链接快照 · 刚刚导入';
        summary.title = url.href;
      }
      closeKnowledgeDialog();
      showToast('在线文档已导入');
    }, 700);
  }

  function knowledgeFolderIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.5h6l2-2h5a2 2 0 0 1 2 2v1M4.5 8.5h15a1.5 1.5 0 0 1 1.45 1.88l-1.8 6.8a2 2 0 0 1-1.94 1.49H4.8a2 2 0 0 1-2-2.18l.5-6.6A1.5 1.5 0 0 1 4.5 8.5Z"/></svg>';
  }

  function createKnowledgeFolder(name) {
    const id = `custom-${state.knowledgeSpace}-${++state.knowledgeDirectorySequence}`;
    state.knowledgeDirectories.set(id, { id, space: state.knowledgeSpace, name });
    if (state.knowledgeSpace === 'public') {
      renderKnowledgeDirectoryList();
      renderKnowledgeProjectFilterOptions();
      selectKnowledgeDirectory(id);
      return id;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.knowledgeDirectory = id;
    button.dataset.knowledgeSpaceScope = state.knowledgeSpace;
    button.innerHTML = `${knowledgeFolderIcon()}<span>${escapeHtml(name)}</span><em>00</em>`;
    $('[data-testid="knowledge-private-directory-list"]').append(button);
    updateKnowledgeDirectoryCounts();
    renderKnowledgeProjectFilterOptions();
    selectKnowledgeDirectory(id);
    return id;
  }

  function createKnowledgeDocument(name, originalFile = null) {
    const fallbackDirectory = state.knowledgeSpace === 'private' ? 'notes' : 'knowledge-directory-guide';
    const directoryId = state.knowledgeDirectoryId === 'all' ? fallbackDirectory : state.knowledgeDirectoryId;
    const directoryButton = $(`[data-knowledge-directory="${directoryId}"]`);
    const directoryName = state.knowledgeDirectories.get(directoryId)?.name
      || $('span', directoryButton)?.textContent
      || '全部文档';
    const extension = name.toLowerCase().split('.').pop();
    const fileType = extension === 'pdf' ? 'PDF' : extension === 'docx' ? 'DOCX' : 'MD';
    const typeClass = fileType === 'PDF' ? 'type-pdf' : fileType === 'DOCX' ? 'type-docx' : 'type-md';
    const row = document.createElement('article');
    row.className = 'knowledge-document-row active';
    row.dataset.knowledgeRow = '';
    row.dataset.space = state.knowledgeSpace;
    row.dataset.knowledgeDirectoryId = directoryId;
    row.dataset.name = name;
    row.dataset.updated = String(++state.knowledgeDocumentSequence);
    row.innerHTML = `<input type="checkbox" aria-label="选择 ${escapeHtml(name)}" data-knowledge-select><div class="knowledge-file"><span class="knowledge-file-type ${typeClass}">${fileType}</span><div><strong>${escapeHtml(name)}</strong><small>刚刚添加 · 正在准备解析与检索。</small></div></div><span class="knowledge-directory-cell">${escapeHtml(directoryName)}</span><span class="knowledge-owner-column">我</span><span class="knowledge-updated-cell">刚刚<small class="status-processing">解析中</small></span><button class="knowledge-row-menu" type="button" data-action="import-knowledge" aria-label="导入 ${escapeHtml(name)} 到对话">›</button>`;
    ensureKnowledgeDetailTrigger(row);
    ensureKnowledgeRowActions(row);
    if (originalFile) knowledgeOriginalFiles.set(row, originalFile);
    $$('[data-knowledge-row]').forEach((item) => item.classList.remove('active'));
    $('[data-knowledge-table-body]').prepend(row);
    updateKnowledgeDirectoryCounts();
    selectKnowledgeDirectory(directoryId);
    return row;
  }

  function submitKnowledgeDialog() {
    const input = $('[data-testid="knowledge-dialog-input"]');
    const name = input.value.trim();
    if (!name) return showToast('请输入名称');
    if (state.knowledgeDialogMode === 'folder') {
      createKnowledgeFolder(name);
      closeKnowledgeDialog();
      return showToast(`已创建文件夹「${name}」`);
    }
    createKnowledgeDocument(name);
    closeKnowledgeDialog();
    showToast(`已添加「${name}」`);
  }

  function creationToolMarkup(tool) {
    const name = escapeHtml(tool.name);
    const description = escapeHtml(tool.description);
    const prompt = escapeHtml(tool.prompt);
    const kicker = escapeHtml(creationCategoryLabels[tool.category]);
    const attributes = `type="button" data-discovery-card data-discovery-type="创作工具" data-creation-tool="${name}" data-prompt="${prompt}"`;
    const testId = tool.visual === 'primary' ? ' data-testid="creation-tool-primary"' : '';
    return `<button class="creation-tool-filter-card" ${attributes}${testId}><span class="tool-card-kicker">${kicker}</span><strong>${name}</strong><small>${description}</small></button>`;
  }

  function createCreationToolElement(tool) {
    const template = document.createElement('template');
    template.innerHTML = creationToolMarkup(tool);
    return template.content.firstElementChild;
  }

  function renderHomeCreationTools() {
    const panel = $('[data-testid="creation-tools-panel"]');
    const filtered = state.creationToolCategory !== 'all';
    panel.classList.toggle('is-filtered', filtered);
    const tools = creationTools.filter((tool) => tool.available !== false
      && (!filtered || tool.category === state.creationToolCategory));
    panel.innerHTML = `<div class="creation-tool-filter-grid" data-testid="creation-tool-shelf" aria-label="创作工具">${tools.map((tool) => creationToolMarkup(tool)).join('')}</div>`;
  }

  function selectCreationToolCategory(category) {
    state.creationToolCategory = category;
    $$('[data-creation-category]').forEach((tab) => {
      const selected = tab.dataset.creationCategory === category;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    renderHomeCreationTools();
  }

  function homeSkillMarkup(skill) {
    const name = escapeHtml(skill.name);
    const title = escapeHtml(skill.title);
    const description = escapeHtml(skill.description);
    const industries = skill.industries.map((industry) => homeSkillIndustryLabels[industry]).join(' · ');
    return `<button class="home-skill-card" type="button" data-home-skill-card data-discovery-card data-discovery-type="Skill" data-use-skill="${name}"><span class="tool-card-kicker">${escapeHtml(industries)}</span><strong>${title}</strong><small>${description}</small></button>`;
  }

  function createHomeSkillElement(skill) {
    const template = document.createElement('template');
    template.innerHTML = homeSkillMarkup(skill);
    return template.content.firstElementChild;
  }

  function renderHomeSkills() {
    const shelf = $('[data-testid="skill-shelf"]');
    const showPlaceholder = state.homeSkillCategory === 'all';
    const skills = showPlaceholder
      ? homeSkills
      : homeSkills.filter((skill) => skill.industries.includes(state.homeSkillCategory));
    shelf.innerHTML = skills.map((skill) => homeSkillMarkup(skill)).join('');
  }

  function selectHomeSkillCategory(category) {
    state.homeSkillCategory = category;
    $$('[data-home-skill-category]').forEach((tab) => {
      const selected = tab.dataset.homeSkillCategory === category;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    renderHomeSkills();
  }

  function selectDiscoveryTab(id) {
    state.discoveryTab = id;
    $$('[data-discovery-tab]').forEach((tab) => {
      const selected = tab.dataset.discoveryTab === id;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    const searching = Boolean($('[data-testid="home-discovery-search"]').value.trim());
    $('[data-testid="creation-tool-categories"]').hidden = searching || id !== 'tools';
    $('[data-testid="home-skill-categories"]').hidden = searching || id !== 'skills';
    $$('[data-discovery-panel]').forEach((panel) => { panel.hidden = searching || panel.dataset.discoveryPanel !== id; });
  }

  function openCreationFlyout() {
    clearTimeout(state.creationFlyoutCloseTimer);
    state.creationFlyoutCloseTimer = null;
    $('.create-nav-entry').classList.add('is-open');
  }

  function syncCreationFlyoutAvailability() {
    const toolsByName = new Map(creationTools.map((tool) => [tool.name, tool]));
    $$('[data-testid="creation-tools-flyout"] [data-tool]').forEach((button) => {
      const tool = toolsByName.get(button.dataset.tool);
      button.hidden = tool?.available === false;
      if (!button.hidden) $('.flyout-tool-title small', button)?.remove();
    });
    $$('[data-testid="creation-tools-flyout"] [data-flyout-panel]').forEach((panel) => {
      panel.hidden = !$$('[data-tool]', panel).some((button) => !button.hidden);
    });
    $$('[data-creation-category]').forEach((tab) => {
      if (tab.dataset.creationCategory === 'all') return;
      tab.hidden = !creationTools.some((tool) => tool.category === tab.dataset.creationCategory && tool.available !== false);
    });
  }

  function closeCreationFlyout(immediate = false) {
    clearTimeout(state.creationFlyoutCloseTimer);
    state.creationFlyoutCloseTimer = null;
    if (immediate) {
      $('.create-nav-entry').classList.remove('is-open');
      return;
    }
    state.creationFlyoutCloseTimer = setTimeout(() => {
      $('.create-nav-entry').classList.remove('is-open');
      state.creationFlyoutCloseTimer = null;
    }, 180);
  }

  function scheduleCreationFlyoutClose() {
    closeCreationFlyout(false);
  }

  function filterHomeDiscovery() {
    const input = $('[data-testid="home-discovery-search"]');
    const results = $('[data-testid="home-discovery-results"]');
    const empty = $('[data-testid="home-discovery-empty"]');
    const query = input.value.trim().toLowerCase();
    if (!query) {
      results.innerHTML = '';
      results.hidden = true;
      empty.hidden = true;
      return selectDiscoveryTab(state.discoveryTab);
    }

    $('[data-testid="creation-tool-categories"]').hidden = true;
    $('[data-testid="home-skill-categories"]').hidden = true;
    $$('[data-discovery-panel]').forEach((panel) => { panel.hidden = true; });
    const toolMatches = creationTools
      .filter((tool) => tool.available !== false
        && `${tool.name} ${tool.description} ${creationCategoryLabels[tool.category]}`.toLowerCase().includes(query))
      .map(createCreationToolElement);
    const skillMatches = homeSkills
      .filter((skill) => `${skill.name} ${skill.title} ${skill.description} ${skill.industries.map((industry) => homeSkillIndustryLabels[industry]).join(' ')}`.toLowerCase().includes(query))
      .map(createHomeSkillElement);
    const matches = [...toolMatches, ...skillMatches];
    results.innerHTML = '';
    matches.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.removeAttribute('data-testid');
      clone.className = 'discovery-result-card';
      const type = document.createElement('span');
      type.className = 'discovery-result-type';
      type.textContent = card.dataset.discoveryType;
      clone.prepend(type);
      results.append(clone);
    });
    results.hidden = matches.length === 0;
    empty.hidden = matches.length > 0;
  }

  function selectProjectTab(id) {
    state.projectScope = id;
    $$('[data-project-tab]').forEach((tab) => {
      const selected = tab.dataset.projectTab === id;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    $$('[data-project-panel]').forEach((panel) => { panel.hidden = panel.dataset.projectPanel !== id; });
    sortProjectCards();
    updateProjectNewButtonAvailability();
  }

  function updateProjectNewButtonAvailability() {
    const button = $('[data-testid="new-project-trigger"]');
    if (!button) return;
    const isPersonal = state.libraryTab === 'projects'
      ? state.projectScope === 'personal'
      : state.assetScope === 'personal';
    button.hidden = !isPersonal;
    button.disabled = !isPersonal;
    button.title = isPersonal ? '新建个人项目' : '';
  }

  function selectLibraryTab(id) {
    state.libraryTab = id;
    $$('[data-library-tab]').forEach((tab) => {
      const selected = tab.dataset.libraryTab === id;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    $$('[data-library-panel]').forEach((panel) => { panel.hidden = panel.dataset.libraryPanel !== id; });
    if (id === 'assets') renderAssetProjectOptions();
    updateProjectConversationBackButton();
    updateProjectNewButtonAvailability();
  }

  function updateProjectConversationBackButton() {
    const button = $('[data-testid="project-conversations-top-back"]');
    if (!button) return;
    button.hidden = !(state.libraryTab === 'projects' && state.projectConversationPageId);
  }

  function renderAssetProjectOptions() {
    const select = $('[data-testid="asset-project-select"]');
    if (!select) return;
    const projects = [...state.projects.values()].filter((project) => project.type === state.assetScope);
    select.innerHTML = '';
    if (!projects.length) {
      const option = new Option(`暂无${state.assetScope === 'team' ? '团队' : '个人'}项目`, '');
      option.disabled = true;
      option.selected = true;
      select.add(option);
      state.assetProjectId = null;
      $('[data-asset-current-project]').textContent = '请选择可用项目';
      return;
    }
    if (!projects.some((project) => project.id === state.assetProjectId)) state.assetProjectId = projects[0].id;
    projects.forEach((project) => select.add(new Option(project.name, project.id, false, project.id === state.assetProjectId)));
    $('[data-asset-current-project]').textContent = state.projects.get(state.assetProjectId).name;
  }

  function selectAssetScope(id) {
    state.assetScope = id;
    $$('[data-asset-scope]').forEach((tab) => {
      const selected = tab.dataset.assetScope === id;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    renderAssetProjectOptions();
    updateProjectNewButtonAvailability();
  }

  function clearAssetPickerSelection() {
    state.assetPickerSelection.clear();
    $$('[data-asset-picker-item]').forEach((item) => {
      item.classList.remove('selected');
      item.setAttribute('aria-pressed', 'false');
    });
    $('[data-asset-picker-selection]').textContent = '尚未选择素材';
    $('[data-action="confirm-asset-picker"]').disabled = true;
  }

  function renderAssetPickerProjectOptions() {
    const select = $('[data-testid="asset-picker-project-select"]');
    const projects = [...state.projects.values()].filter((project) => project.type === state.assetPickerScope);
    select.innerHTML = '';
    if (!projects.length) {
      const option = new Option(`暂无${state.assetPickerScope === 'team' ? '团队' : '个人'}项目`, '');
      option.disabled = true;
      option.selected = true;
      select.add(option);
      state.assetPickerProjectId = null;
      return;
    }
    if (!projects.some((project) => project.id === state.assetPickerProjectId)) {
      state.assetPickerProjectId = projects[0].id;
    }
    projects.forEach((project) => {
      select.add(new Option(project.name, project.id, false, project.id === state.assetPickerProjectId));
    });
  }

  function filterAssetPickerItems() {
    $$('[data-asset-picker-item]').forEach((item) => {
      const scopeMismatch = item.dataset.assetPickerItemScope !== state.assetPickerScope;
      const projectMismatch = Boolean(item.dataset.projectId)
        && item.dataset.projectId !== state.assetPickerProjectId;
      item.hidden = scopeMismatch || projectMismatch;
    });
  }

  function setAssetPickerScope(id) {
    state.assetPickerScope = id;
    $$('[data-asset-picker-scope]').forEach((tab) => {
      const selected = tab.dataset.assetPickerScope === id;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    renderAssetPickerProjectOptions();
    filterAssetPickerItems();
  }

  function openAssetPicker() {
    closeOverlays();
    $('[data-testid="knowledge-picker-dialog"]').hidden = true;
    clearKnowledgePickerSelection();
    clearAssetPickerSelection();
    setAssetPickerScope('personal');
    $('[data-testid="asset-picker-dialog"]').hidden = false;
  }

  function closeAssetPicker() {
    $('[data-testid="asset-picker-dialog"]').hidden = true;
    clearAssetPickerSelection();
    state.materialTarget = null;
  }

  function selectAssetPickerItem(item) {
    const name = item.dataset.assetPickerItem;
    const origin = assetReferenceOrigin(item);
    const id = composerReferenceId('asset', name, origin);
    if (state.assetPickerSelection.has(id)) state.assetPickerSelection.delete(id);
    else state.assetPickerSelection.set(id, { name, origin });
    $$('[data-asset-picker-item]').forEach((candidate) => {
      const selected = state.assetPickerSelection.has(composerReferenceId(
        'asset', candidate.dataset.assetPickerItem, assetReferenceOrigin(candidate)
      ));
      candidate.classList.toggle('selected', selected);
      candidate.setAttribute('aria-pressed', String(selected));
    });
    const count = state.assetPickerSelection.size;
    $('[data-asset-picker-selection]').textContent = count ? `已选择 ${count} 个素材` : '尚未选择素材';
    $('[data-action="confirm-asset-picker"]').disabled = count === 0;
  }

  function confirmAssetPicker() {
    const resources = [...state.assetPickerSelection.values()];
    if (!resources.length) return;
    const targetSurface = state.materialTarget || 'home';
    resources.forEach(({ name, origin }) => addComposerReference(targetSurface, 'asset', name, 'asset', 'picker', origin));
    closeAssetPicker();
    showToast(resources.length === 1 ? `已添加「${resources[0].name}」` : `已添加 ${resources.length} 个素材`);
  }

  function updateKnowledgePickerSelectionState() {
    const count = state.knowledgePickerSelection.size;
    $('[data-testid="knowledge-picker-selection"]').textContent = count ? `已选择 ${count} 个文档` : '尚未选择文档';
    $('[data-action="confirm-knowledge-picker"]').disabled = count === 0;
    $$('[data-knowledge-picker-item]').forEach((item) => {
      item.setAttribute('aria-pressed', String(state.knowledgePickerSelection.has(
        composerReferenceId('knowledge', item.dataset.knowledgePickerItem, item.dataset.knowledgePickerOrigin)
      )));
    });
  }

  function clearKnowledgePickerSelection() {
    state.knowledgePickerSelection.clear();
    updateKnowledgePickerSelectionState();
  }

  function renderKnowledgePicker() {
    const root = $('[data-knowledge-picker-list]');
    const rows = $$('[data-knowledge-row]').filter((row) => (
      (row.dataset.space || 'public') === state.knowledgePickerSpace
      && !row.hasAttribute('data-knowledge-folder-row')
      && row.dataset.trashed !== 'true'
    ));
    root.innerHTML = rows.map((row) => {
      const name = row.dataset.name || '未命名文档';
      const type = $('.knowledge-file-type', row)?.textContent.trim() || 'DOC';
      const summary = $('.knowledge-file small', row)?.textContent.trim() || '资料库文档';
      const directory = $('.knowledge-directory-cell', row)?.textContent.trim() || '未分类';
      const origin = knowledgeReferenceOrigin(row);
      const selected = state.knowledgePickerSelection.has(composerReferenceId('knowledge', name, origin));
      return `<button class="knowledge-picker-item" type="button" data-action="toggle-knowledge-picker-item" data-knowledge-picker-item="${escapeHtml(name)}" data-knowledge-picker-origin="${escapeHtml(origin)}" aria-pressed="${String(selected)}"><span class="knowledge-picker-type" aria-hidden="true">${escapeHtml(type)}</span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(summary)}</small><em>${escapeHtml(directory)}</em></button>`;
    }).join('');
    updateKnowledgePickerSelectionState();
  }

  function selectKnowledgePickerSpace(space) {
    state.knowledgePickerSpace = space === 'private' ? 'private' : 'public';
    $$('[data-knowledge-picker-space]').forEach((tab) => {
      const selected = tab.dataset.knowledgePickerSpace === state.knowledgePickerSpace;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    renderKnowledgePicker();
  }

  function openKnowledgePicker() {
    closeOverlays();
    $('[data-testid="asset-picker-dialog"]').hidden = true;
    clearAssetPickerSelection();
    clearKnowledgePickerSelection();
    selectKnowledgePickerSpace('public');
    $('[data-testid="knowledge-picker-dialog"]').hidden = false;
  }

  function closeKnowledgePicker() {
    $('[data-testid="knowledge-picker-dialog"]').hidden = true;
    clearKnowledgePickerSelection();
    state.materialTarget = null;
  }

  function toggleKnowledgePickerItem(item) {
    const name = item.dataset.knowledgePickerItem;
    const origin = item.dataset.knowledgePickerOrigin;
    const id = composerReferenceId('knowledge', name, origin);
    if (state.knowledgePickerSelection.has(id)) state.knowledgePickerSelection.delete(id);
    else state.knowledgePickerSelection.set(id, { name, origin });
    updateKnowledgePickerSelectionState();
  }

  function confirmKnowledgePicker() {
    const resources = [...state.knowledgePickerSelection.values()];
    if (!resources.length) return;
    const targetSurface = state.materialTarget || 'home';
    resources.forEach(({ name, origin }) => addComposerReference(targetSurface, 'knowledge', name, 'knowledge', 'picker', origin));
    closeKnowledgePicker();
    showToast(resources.length === 1 ? `已添加「${resources[0].name}」` : `已添加 ${resources.length} 个资料库文档`);
  }

  function filterProjects(query) {
    const normalized = query.trim().toLowerCase();
    $$('[data-project-item]').forEach((project) => {
      project.hidden = Boolean(normalized) && !project.dataset.projectName.toLowerCase().includes(normalized);
    });
  }

  function closeProjectSortMenu() {
    const trigger = $('[data-testid="project-sort-trigger"]');
    const menu = $('[data-testid="project-sort-menu"]');
    if (!trigger || !menu) return;
    trigger.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
  }

  function toggleProjectSortMenu() {
    const trigger = $('[data-testid="project-sort-trigger"]');
    const menu = $('[data-testid="project-sort-menu"]');
    const willOpen = menu.hidden;
    closeTransientDropdowns();
    if (willOpen) {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }
  }

  function sortProjectCards(sort = state.projectCardSort) {
    const collator = new Intl.Collator('zh-CN', { numeric: true, sensitivity: 'base' });
    $$('.project-card-grid').forEach((grid) => {
      const projects = $$('[data-project-item]', grid);
      projects.sort((first, second) => {
        const unboundDifference = Number(first.dataset.projectId === 'unbound-project') - Number(second.dataset.projectId === 'unbound-project');
        if (unboundDifference) return unboundDifference;
        if (sort === 'name') return collator.compare(first.dataset.projectName, second.dataset.projectName);
        const key = sort === 'created' ? 'projectCreated' : 'projectUpdated';
        const difference = Number(second.dataset[key] || 0) - Number(first.dataset[key] || 0);
        return difference || Number(second.dataset.projectCreated || 0) - Number(first.dataset.projectCreated || 0);
      });
      grid.append(...projects);
    });
  }

  function selectProjectCardSort(sort) {
    const labels = { updated: '最近更新', created: '最近创建', name: '字母顺序' };
    if (!labels[sort]) return;
    state.projectCardSort = sort;
    $('[data-project-sort-label]').textContent = labels[sort];
    $$('[data-project-card-sort]').forEach((item) => {
      item.setAttribute('aria-checked', String(item.dataset.projectCardSort === sort));
    });
    sortProjectCards(sort);
    closeProjectSortMenu();
  }

  function touchProjectCard(project, created = false) {
    if (!project) return;
    const sequence = ++state.projectCardActivitySequence;
    if (created || !project.dataset.projectCreated) project.dataset.projectCreated = String(sequence);
    project.dataset.projectUpdated = String(sequence);
    sortProjectCards();
  }

  function renderProjectPickerOptions() {
    const root = $('[data-project-picker-options]');
    const groups = [
      ['personal', '个人项目'],
      ['team', '团队项目']
    ];
    root.innerHTML = groups.map(([type, label]) => {
      const projects = [...state.projects.values()].filter((project) => project.type === type);
      if (!projects.length) return '';
      const options = projects.map((project) => `
        <button class="project-picker-option" type="button" role="menuitem" data-select-project="${project.id}" aria-checked="${String(state.selectedProjectId === project.id)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.5h6l2-2h4.8a2 2 0 0 1 2 2v1M4.5 8.5h15a1.5 1.5 0 0 1 1.45 1.88l-2 7.5A2.2 2.2 0 0 1 16.82 19.5H4.7a2 2 0 0 1-2-2.2l.6-7.45A1.5 1.5 0 0 1 4.5 8.5Z"/></svg>
          <span>${escapeHtml(project.name)}</span>${state.selectedProjectId === project.id ? '<i>✓</i>' : ''}
        </button>`).join('');
      return `<div class="project-picker-group">${label}</div>${options}`;
    }).join('');
  }

  function selectComposerProject(id) {
    state.selectedProjectId = id && state.projects.has(id) ? id : null;
    const selected = state.selectedProjectId ? state.projects.get(state.selectedProjectId) : null;
    $('[data-selected-project-label]').textContent = selected ? selected.name : '选择项目';
    closeOverlays();
  }

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  function pushpinIconMarkup() {
    return '<svg data-icon="pushpin" viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 4 5.5 5.5-3.2 1.1-4.2 4.2-.7 3.7-3.2-3.2-3.2-3.2 3.7-.7 4.2-4.2L14.5 4Z"/><path d="m9.2 15.3-5.2 5.2"/></svg>';
  }

  function emptyInstalledSkillsMarkup() {
    return '<div class="empty-state"><h2>还没有安装 Skill</h2><p>选择Skill运行成功后会添加到此处</p></div>';
  }

  function renderInstalledSkills() {
    const root = $('[data-installed-skills]');
    if (!state.installedSkills.size) {
      root.innerHTML = emptyInstalledSkillsMarkup();
      renderComposerSkills();
      return;
    }
    root.innerHTML = [...state.installedSkills].map((name) => `
      <article class="installed-card" data-installed-skill="${escapeHtml(name)}">
        <span class="placeholder-badge">已安装</span>
        <strong>${escapeHtml(name)}</strong>
        <small>可在创作对话中直接调用</small>
        <button class="installed-skill-run" type="button" data-action="run-installed-skill" data-skill-name="${escapeHtml(name)}" aria-label="运行并使用 ${escapeHtml(name)}">运行并使用</button>
      </article>`).join('');
    renderComposerSkills();
  }

  function runInstalledSkill(name) {
    if (!state.installedSkills.has(name)) return;
    setView('create');
    setSelectedSkill(name);
    setPrompt('先说明这个技能的最佳使用场景和调用方法，再协助我完成：', true);
    showToast(`已选择「${name}」`);
  }

  function installAndUseSkill(name) {
    state.installedSkills.add(name);
    renderInstalledSkills();
    runInstalledSkill(name);
    showToast(`已添加「${name}」并带入对话`);
  }

  function projectCardMarkup(name, dateLabel = '刚刚', type = 'personal') {
    const safeName = escapeHtml(name);
    const targetType = type === 'team' ? 'personal' : 'team';
    const targetLabel = targetType === 'team' ? '团队项目' : '个人项目';
    return `<button class="project-open-button" type="button" data-action="open-project" aria-label="打开 ${safeName}"><span class="folder-card-visual" aria-hidden="true"><i></i><b><svg viewBox="0 0 24 24"><path d="M4.5 8h6l2-2h4a2 2 0 0 1 2 2v1M5 9h14a1.5 1.5 0 0 1 1.4 2l-1.8 6.3a2 2 0 0 1-1.9 1.4H5a2 2 0 0 1-2-2.2l.5-6.1A1.5 1.5 0 0 1 5 9Z"/></svg></b></span><span class="folder-card-info"><strong title="${safeName}">${safeName}</strong><small>${dateLabel}</small></span></button><button class="project-move-button" type="button" data-action="toggle-project-move" data-dropdown-boundary aria-label="移动 ${safeName}" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10m0 0-3-3m3 3-3 3M17 17H7m0 0 3-3m-3 3 3 3"/></svg></button><button class="project-rename-button" type="button" data-action="rename-project" aria-label="重命名 ${safeName}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l11-11-4-4L4 16v4ZM13.5 6.5l4 4"/></svg></button><div class="project-move-menu" data-project-move-menu data-dropdown-boundary hidden role="menu"><button type="button" role="menuitem" data-action="move-project" data-move-project-to="${targetType}">移动到${targetLabel}</button></div>`;
  }

  function isSidebarProjectPinned(projectId) {
    return Boolean(state.projects.get(projectId)?.pinned);
  }

  function applySidebarProjectLayout() {
    const root = $('[data-sidebar-project-list]');
    const projects = $$('[data-sidebar-project]', root);
    projects.forEach((project) => {
      if (!project.dataset.sidebarOrder) project.dataset.sidebarOrder = String(state.sidebarProjectOrderSequence++);
      if (!project.dataset.lastOpened) project.dataset.lastOpened = '0';
    });
    projects.sort((a, b) => {
      const unboundDifference = Number(a.dataset.projectId === 'unbound-project') - Number(b.dataset.projectId === 'unbound-project');
      return unboundDifference || Number(a.dataset.sidebarOrder) - Number(b.dataset.sidebarOrder);
    });
    projects.forEach((project) => {
      const projectId = project.dataset.projectId;
      const children = getSortedProjectChildren(projectId, root);
      root.append(project, ...children);
      const grouped = state.sidebarProjectGroup === 'project';
      const pinned = isSidebarProjectPinned(projectId);
      project.draggable = grouped && !pinned && projectId !== 'unbound-project';
      project.hidden = !grouped || pinned;
      children.forEach((child) => {
        child.draggable = child.matches('[data-sidebar-conversation]');
        child.hidden = pinned || (grouped
          ? project.getAttribute('aria-expanded') === 'false'
          : child.matches('[data-project-directory]'));
      });
    });
    $('.project-tree').classList.toggle('is-ungrouped', state.sidebarProjectGroup === 'none');
    renderSidebarPinnedItems();
  }

  function clearSidebarProjectDragState() {
    $$('[data-sidebar-project]').forEach((project) => {
      project.classList.remove('is-dragging', 'is-drop-before', 'is-drop-after');
    });
    state.sidebarDraggedProjectId = null;
    state.sidebarDropProjectId = null;
    state.sidebarDropAfter = false;
  }

  function clearSidebarConversationDragState() {
    $$('[data-sidebar-conversation]').forEach((conversation) => {
      conversation.classList.remove('is-dragging');
    });
    $$('[data-sidebar-pinned-conversation]').forEach((conversation) => {
      conversation.classList.remove('is-dragging');
    });
    $$('[data-sidebar-project]').forEach((project) => {
      project.classList.remove('is-conversation-drop-target');
    });
    $$('[data-pinned-project-id]').forEach((project) => {
      project.classList.remove('is-conversation-drop-target');
    });
    state.sidebarDraggedConversationId = null;
    state.sidebarDraggedConversationProjectId = null;
    state.sidebarDropConversationTargetProjectId = null;
  }

  function moveConversationToProject(sourceProjectId, conversationId, targetProjectId) {
    if (!sourceProjectId || !conversationId || !targetProjectId || sourceProjectId === targetProjectId) return;
    const sourceProject = state.projects.get(sourceProjectId);
    const targetProject = state.projects.get(targetProjectId);
    if (!sourceProject || !targetProject) return;
    const conversationIndex = sourceProject.conversations.findIndex((item) => item.id === conversationId);
    if (conversationIndex < 0) return;
    const [conversation] = sourceProject.conversations.splice(conversationIndex, 1);
    const nextOrder = targetProject.conversations.reduce((highest, item) => Math.max(highest, Number(item.order || 0)), -1) + 1;
    conversation.order = nextOrder;
    targetProject.conversations.push(conversation);

    const row = $(`[data-sidebar-conversation][data-project-id="${sourceProjectId}"][data-conversation-id="${conversationId}"]`);
    if (row) {
      row.dataset.projectId = targetProjectId;
      row.dataset.parentProjectId = targetProjectId;
      row.dataset.sidebarOrder = String(conversation.order);
      row.hidden = false;
    }
    const targetProjectRow = $(`[data-sidebar-project][data-project-id="${targetProjectId}"]`);
    if (targetProjectRow) targetProjectRow.setAttribute('aria-expanded', 'true');
    const targetPinnedProject = $(`[data-pinned-project-id="${targetProjectId}"]`);
    if (targetPinnedProject) {
      const targetProjectRecord = state.projects.get(targetProjectId);
      targetProjectRecord.pinnedExpanded = true;
    }
    const conversationView = $('[data-testid="conversation-view"]');
    if (conversationView?.dataset.conversationId === conversationId && conversationView.dataset.projectId === sourceProjectId) {
      conversationView.dataset.projectId = targetProjectId;
      selectComposerProject(targetProjectId === 'unbound-project' ? null : targetProjectId);
    }
    applySidebarProjectLayout();
    if (state.projectConversationPageId === sourceProjectId || state.projectConversationPageId === targetProjectId) {
      renderProjectConversations(state.projectConversationPageId);
    }
    renderSidebarPinnedItems();
    showToast(`对话已移动到「${targetProject.name}」`);
  }

  function reorderSidebarProject(draggedProjectId, targetProjectId, placeAfter) {
    if (!draggedProjectId || !targetProjectId || draggedProjectId === targetProjectId) return;
    if (draggedProjectId === 'unbound-project' || targetProjectId === 'unbound-project') return;
    if (isSidebarProjectPinned(draggedProjectId) || isSidebarProjectPinned(targetProjectId)) return;
    const root = $('[data-sidebar-project-list]');
    const projects = $$('[data-sidebar-project]', root)
      .filter((project) => project.dataset.projectId !== 'unbound-project' && !isSidebarProjectPinned(project.dataset.projectId))
      .sort((first, second) => Number(first.dataset.sidebarOrder) - Number(second.dataset.sidebarOrder));
    const availableOrders = projects.map((project) => Number(project.dataset.sidebarOrder)).sort((a, b) => a - b);
    const dragged = projects.find((project) => project.dataset.projectId === draggedProjectId);
    const target = projects.find((project) => project.dataset.projectId === targetProjectId);
    if (!dragged || !target) return;
    projects.splice(projects.indexOf(dragged), 1);
    const targetIndex = projects.indexOf(target);
    projects.splice(targetIndex + (placeAfter ? 1 : 0), 0, dragged);
    projects.forEach((project, index) => { project.dataset.sidebarOrder = String(availableOrders[index]); });
    state.sidebarProjectOrderSequence = Math.max(state.sidebarProjectOrderSequence, ...availableOrders.map((order) => order + 1), 1);
    state.sidebarProjectSort = 'manual';
    $$('[data-sidebar-project-sort]').forEach((item) => {
      item.setAttribute('aria-checked', String(item.dataset.sidebarProjectSort === 'manual'));
    });
    applySidebarProjectLayout();
    showToast('项目目录位置已更新');
  }

  function renderSidebarPinnedItems() {
    const section = $('[data-testid="sidebar-pinned-section"]');
    const list = $('[data-sidebar-pinned-list]');
    if (!section || !list) return;
    const activeProjectId = $('[data-sidebar-project].active')?.dataset.projectId || null;
    const items = [];

    state.projects.forEach((project) => {
      if (project.pinned) {
        const expanded = project.pinnedExpanded !== false;
        const childrenId = `sidebar-pinned-children-${project.id}`;
        const conversations = [...project.conversations].sort((first, second) => Number(first.order || 0) - Number(second.order || 0));
        const childrenMarkup = conversations.map((conversation) => `
          <div class="sidebar-pinned-item sidebar-pinned-child${state.activeConversationId === conversation.id ? ' active' : ''}" draggable="true" data-sidebar-pinned-conversation data-pinned-conversation-id="${escapeHtml(conversation.id)}" data-project-id="${escapeHtml(project.id)}" data-parent-project-id="${escapeHtml(project.id)}" data-conversation-id="${escapeHtml(conversation.id)}">
            <button class="sidebar-pinned-open" type="button" data-action="open-pinned-conversation" data-project-id="${escapeHtml(project.id)}" data-conversation-id="${escapeHtml(conversation.id)}" aria-label="打开置顶对话 ${escapeHtml(conversation.title)}">
              <span title="${escapeHtml(conversation.title)}">${escapeHtml(conversation.title)}</span>
            </button>
          </div>`).join('');
        items.push({
          order: Number(project.pinnedAt || 0),
          markup: `<div class="sidebar-pinned-project" data-pinned-project-id="${escapeHtml(project.id)}">
            <div class="sidebar-pinned-item${activeProjectId === project.id && !state.activeConversationId ? ' active' : ''}">
              <button class="sidebar-pinned-open sidebar-pinned-project-toggle" type="button" data-action="toggle-pinned-project" data-project-id="${escapeHtml(project.id)}" aria-label="${expanded ? '折叠' : '展开'}置顶项目 ${escapeHtml(project.name)}" aria-expanded="${String(expanded)}" aria-controls="${escapeHtml(childrenId)}">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.5h6l2-2h4.8a2 2 0 0 1 2 2v1M4.5 8.5h15a1.5 1.5 0 0 1 1.45 1.88l-2 7.5A2.2 2.2 0 0 1 16.82 19.5H4.7a2 2 0 0 1-2-2.2l.6-7.45A1.5 1.5 0 0 1 4.5 8.5Z"/></svg><span title="${escapeHtml(project.name)}">${escapeHtml(project.name)}</span><i class="sidebar-pinned-chevron" aria-hidden="true"></i>
              </button>
              <button class="sidebar-pinned-create-conversation" type="button" data-action="new-pinned-project-conversation" data-project-id="${escapeHtml(project.id)}" aria-label="在${escapeHtml(project.name)}中创建对话" title="在项目内创建对话"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6.5M14.5 4.5l5 5M12 12l2.2-.5 5.3-5.3-1.7-1.7-5.3 5.3L12 12Z"/></svg></button>
              <button class="sidebar-pinned-toggle" type="button" data-action="unpin-pinned-project" data-project-id="${escapeHtml(project.id)}" aria-label="取消置顶项目 ${escapeHtml(project.name)}" title="取消置顶">${pushpinIconMarkup()}</button>
            </div>
            <div class="sidebar-pinned-children" id="${escapeHtml(childrenId)}" data-pinned-project-children${expanded ? '' : ' hidden'}>${childrenMarkup}</div>
          </div>`
        });
      }
      project.conversations.filter((conversation) => conversation.pinned && !project.pinned).forEach((conversation) => {
        items.push({
          order: Number(conversation.pinnedAt || 0),
          markup: `<div class="sidebar-pinned-item${state.activeConversationId === conversation.id ? ' active' : ''}" draggable="true" data-sidebar-pinned-conversation data-pinned-conversation-id="${escapeHtml(conversation.id)}" data-project-id="${escapeHtml(project.id)}" data-parent-project-id="${escapeHtml(project.id)}" data-conversation-id="${escapeHtml(conversation.id)}"><button class="sidebar-pinned-open" type="button" data-action="open-pinned-conversation" data-project-id="${escapeHtml(project.id)}" data-conversation-id="${escapeHtml(conversation.id)}" aria-label="打开置顶对话 ${escapeHtml(conversation.title)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v11H9l-5 3v-14Z"/></svg><span title="${escapeHtml(conversation.title)}">${escapeHtml(conversation.title)}</span></button><button class="sidebar-pinned-toggle" type="button" data-action="unpin-pinned-conversation" data-project-id="${escapeHtml(project.id)}" data-conversation-id="${escapeHtml(conversation.id)}" aria-label="取消置顶对话 ${escapeHtml(conversation.title)}" title="取消置顶">${pushpinIconMarkup()}</button></div>`
        });
      });
    });

    items.sort((first, second) => first.order - second.order);
    list.innerHTML = items.map((item) => item.markup).join('');
    section.hidden = items.length === 0;
  }

  function selectSidebarProjectGroup(group) {
    state.sidebarProjectGroup = group;
    $$('[data-sidebar-project-group]').forEach((item) => {
      item.setAttribute('aria-checked', String(item.dataset.sidebarProjectGroup === group));
    });
    applySidebarProjectLayout();
    closeOverlays();
  }

  function selectSidebarProjectSort(sort) {
    state.sidebarProjectSort = sort;
    $$('[data-sidebar-project-sort]').forEach((item) => {
      item.setAttribute('aria-checked', String(item.dataset.sidebarProjectSort === sort));
    });
    applySidebarProjectLayout();
    closeOverlays();
  }

  function markSidebarProjectOpened(projectId) {
    const project = $(`[data-sidebar-project][data-project-id="${projectId}"]`);
    if (!project) return;
    project.dataset.lastOpened = String(++state.sidebarProjectOpenSequence);
    if (state.sidebarProjectSort === 'recent') applySidebarProjectLayout();
  }

  function addSidebarProject(id, name) {
    if ($(`[data-sidebar-project][data-project-id="${id}"]`)) return;
    const button = document.createElement('button');
    button.className = 'tree-row tree-row--project';
    button.type = 'button';
    button.dataset.sidebarProject = '';
    button.dataset.projectId = id;
    button.dataset.projectName = name;
    button.title = name;
    button.dataset.sidebarOrder = String(state.sidebarProjectOrderSequence++);
    button.dataset.lastOpened = '0';
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = `<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.5h6l2-2h4.8a2 2 0 0 1 2 2v1M4.5 8.5h15a1.5 1.5 0 0 1 1.45 1.88l-2 7.5A2.2 2.2 0 0 1 16.82 19.5H4.7a2 2 0 0 1-2-2.2l.6-7.45A1.5 1.5 0 0 1 4.5 8.5Z"/></svg><span class="tree-project-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span><span class="sidebar-project-controls" data-sidebar-project-control data-dropdown-boundary><span class="sidebar-project-more" data-action="toggle-sidebar-project-menu" role="button" tabindex="0" aria-label="${escapeHtml(name)} 的项目操作" aria-haspopup="menu" aria-expanded="false">•••</span><span class="sidebar-project-new-conversation" data-action="new-project-conversation" role="button" tabindex="0" aria-label="在${escapeHtml(name)}中创建对话" title="在项目内创建对话"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6.5M14.5 4.5l5 5M12 12l2.2-.5 5.3-5.3-1.7-1.7-5.3 5.3L12 12Z"/></svg></span></span><span class="sidebar-project-pin" data-action="toggle-project-pin" data-sidebar-project-control role="button" tabindex="0" aria-label="置顶项目 ${escapeHtml(name)}" title="置顶">${pushpinIconMarkup()}</span>`;
    const root = $('[data-sidebar-project-list]');
    root.append(button);
    applySidebarProjectLayout();
  }

  function closeSidebarProjectActionMenu() {
    const menu = $('[data-testid="sidebar-project-action-menu"]');
    if (!menu) return;
    menu.hidden = true;
    menu.removeAttribute('data-project-id');
    $$('[data-action="toggle-sidebar-project-menu"]').forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    state.projectActionTargetId = null;
  }

  function toggleSidebarProjectActionMenu(projectId) {
    const trigger = $(`[data-sidebar-project][data-project-id="${projectId}"] [data-action="toggle-sidebar-project-menu"]`);
    const menu = $('[data-testid="sidebar-project-action-menu"]');
    const wasOpen = !menu.hidden && state.projectActionTargetId === projectId;
    closeTransientDropdowns();
    if (wasOpen || !trigger) return;
    if (!state.projects.has(projectId)) return;
    state.projectActionTargetId = projectId;
    menu.dataset.projectId = projectId;
    menu.hidden = false;
    const triggerBox = trigger.getBoundingClientRect();
    const menuBox = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(8, Math.min(triggerBox.right - menuBox.width, window.innerWidth - menuBox.width - 8))}px`;
    menu.style.top = `${Math.max(8, Math.min(triggerBox.bottom + 4, window.innerHeight - menuBox.height - 8))}px`;
    trigger.setAttribute('aria-expanded', 'true');
  }

  function toggleProjectPin(projectId) {
    const record = state.projects.get(projectId);
    if (!record) return;
    record.pinned = !record.pinned;
    record.pinnedAt = record.pinned ? ++state.sidebarPinnedOrderSequence : 0;
    if (record.pinned) record.pinnedExpanded = true;
    const sidebarProject = $(`[data-sidebar-project][data-project-id="${projectId}"]`);
    sidebarProject?.classList.toggle('is-pinned', record.pinned);
    const pin = sidebarProject && $('[data-action="toggle-project-pin"]', sidebarProject);
    if (pin) {
      pin.setAttribute('aria-label', `${record.pinned ? '取消置顶' : '置顶'}项目 ${record.name}`);
      pin.title = record.pinned ? '取消置顶' : '置顶';
    }
    applySidebarProjectLayout();
    closeSidebarProjectActionMenu();
    showToast(record.pinned ? '项目已置顶' : '已取消项目置顶');
  }

  function togglePinnedProject(projectId) {
    const project = state.projects.get(projectId);
    if (!project?.pinned) return;
    project.pinnedExpanded = project.pinnedExpanded === false;
    renderSidebarPinnedItems();
  }

  function openProjectDeleteDialog(projectId) {
    const record = state.projects.get(projectId);
    if (!record) return;
    if (projectId === 'unbound-project') {
      closeSidebarProjectActionMenu();
      return showToast('未分类项目为系统文件夹，不能删除');
    }
    closeSidebarProjectActionMenu();
    state.projectDeleteTargetId = projectId;
    $('[data-project-delete-name]').textContent = record.name;
    $('[data-testid="project-delete-dialog"]').hidden = false;
  }

  function closeProjectDeleteDialog() {
    const dialog = $('[data-testid="project-delete-dialog"]');
    if (dialog) dialog.hidden = true;
    state.projectDeleteTargetId = null;
  }

  function ensureProjectPanelEmptyState(root, type) {
    if (!root || $('[data-project-item]', root) || $('.project-empty-state', root)) return;
    const empty = document.createElement('div');
    empty.className = 'project-empty-state';
    empty.textContent = type === 'team' ? '暂无团队项目' : '暂无个人项目';
    root.append(empty);
  }

  function clearProjectConversationTimers(projectId, conversations) {
    conversations.forEach((conversation) => {
      clearTimeout(conversation.completionTimer);
      conversation.completionTimer = null;
      if (conversation.status === 'running') conversation.status = 'complete';
    });
    [...state.conversationReplyJobs.entries()].forEach(([key, timer]) => {
      if (!key.startsWith(`${projectId}:`)) return;
      clearTimeout(timer);
      state.conversationReplyJobs.delete(key);
    });
  }

  function deleteProject(projectId, keepContent) {
    const record = state.projects.get(projectId);
    if (!record || projectId === 'unbound-project') return;
    const projectCard = $(`[data-project-item][data-project-id="${projectId}"]`);
    const projectPanel = projectCard?.parentElement;
    const conversations = [...record.conversations];
    const projectAssetNames = $$(`[data-asset-picker-item][data-project-id="${projectId}"]`)
      .map((item) => item.dataset.assetPickerItem);
    const projectTasks = state.scheduledTasks.filter((task) => task.projectId === projectId);
    const needsUnbound = keepContent || projectTasks.length > 0;
    const unbound = needsUnbound ? ensureUnboundProject() : null;
    clearProjectConversationTimers(projectId, conversations);

    if (keepContent && unbound) {
      unbound.conversations.push(...conversations);
      conversations.forEach((conversation) => {
        $(`[data-sidebar-conversation][data-project-id="${projectId}"][data-conversation-id="${conversation.id}"]`)?.remove();
        addSidebarConversation(unbound.id, conversation);
      });
      setProjectExpanded(unbound.id, true);
      $$(`[data-parent-project-id="${projectId}"]`).forEach((item) => {
        item.dataset.parentProjectId = unbound.id;
        item.dataset.projectId = unbound.id;
      });
      $$(`[data-project-file][data-project-id="${projectId}"]`).forEach((item) => { item.dataset.projectId = unbound.id; });
      $$(`[data-asset-picker-item][data-project-id="${projectId}"]`).forEach((item) => { item.dataset.projectId = unbound.id; });
      reconcileComposerAssetProject(projectId, unbound.id);
      if ($('[data-testid="conversation-view"]').dataset.projectId === projectId) {
        $('[data-testid="conversation-view"]').dataset.projectId = unbound.id;
      }
    } else {
      $$(`[data-parent-project-id="${projectId}"]`).forEach((item) => item.remove());
      $$(`[data-project-file][data-project-id="${projectId}"]`).forEach((item) => item.remove());
      $$(`[data-asset-picker-item][data-project-id="${projectId}"]`).forEach((item) => item.remove());
      reconcileComposerAssetProject(projectId);
      if ($('[data-testid="conversation-view"]').dataset.projectId === projectId) {
        setActiveConversation(null);
        setView('create');
      }
      if (projectAssetNames.includes(state.selectedAsset)) setSelectedAsset(null);
      if (projectAssetNames.includes(state.conversationAsset)) setSelectedAsset(null, 'conversation');
      if ([...state.assetPickerSelection.values()].some((selection) => projectAssetNames.includes(selection.name))) {
        clearAssetPickerSelection();
      }
    }

    if (unbound) projectTasks.forEach((task) => { task.projectId = unbound.id; });
    state.projects.delete(projectId);
    projectCard?.remove();
    $(`[data-sidebar-project][data-project-id="${projectId}"]`)?.remove();
    ensureProjectPanelEmptyState(projectPanel, record.type);

    if (state.selectedProjectId === projectId) selectComposerProject(keepContent && unbound ? unbound.id : null);
    if (state.assetProjectId === projectId) state.assetProjectId = keepContent && unbound ? unbound.id : null;
    if (state.assetPickerProjectId === projectId) state.assetPickerProjectId = keepContent && unbound ? unbound.id : null;
    closeProjectDeleteDialog();
    renderAssetProjectOptions();
    renderAssetPickerProjectOptions();
    filterAssetPickerItems();
    renderScheduledTasks();
    applySidebarProjectLayout();
    filterProjects($('[data-testid="project-search"]').value);
    showToast(keepContent ? '项目文件夹已删除，内容已移至未分类项目' : '项目及其内容已删除');
  }

  function addSidebarConversation(projectId, conversation) {
    const projectButton = $(`[data-sidebar-project][data-project-id="${projectId}"]`);
    if (!projectButton) return;
    const button = document.createElement('button');
    button.className = 'tree-row tree-row--indented tree-row--conversation';
    button.type = 'button';
    button.dataset.sidebarConversation = '';
    button.dataset.projectId = projectId;
    button.dataset.parentProjectId = projectId;
    button.dataset.conversationId = conversation.id;
    button.dataset.status = conversation.status;
    button.dataset.sidebarOrder = String(conversation.order);
    button.dataset.lastOpened = String(conversation.lastOpened || 0);
    button.hidden = projectButton.getAttribute('aria-expanded') === 'false';
    button.setAttribute('aria-label', `打开 ${conversation.title}`);
    button.title = conversation.title;
    button.innerHTML = conversationSidebarMarkup(conversation);
    const children = $$(`[data-parent-project-id="${projectId}"]`);
    (children.at(-1) || projectButton).insertAdjacentElement('afterend', button);
    syncSidebarConversation(projectId, conversation);
    sortProjectConversations(projectId);
  }

  function conversationSidebarMarkup(conversation) {
    const safeTitle = escapeHtml(conversation.title);
    const running = conversation.status === 'running';
    return `<span class="conversation-mark" aria-hidden="true"></span><span class="conversation-status" data-conversation-status><span class="conversation-spinner" data-conversation-spinner${running ? '' : ' hidden'} aria-hidden="true"></span><span class="conversation-unread-dot" data-conversation-unread${!running && conversation.unread ? '' : ' hidden'} aria-label="未读"></span></span><span class="conversation-pin-control" data-action="toggle-conversation-pin" data-conversation-pin role="button" tabindex="0" aria-label="${conversation.pinned ? '取消置顶对话' : '置顶对话'}" title="${conversation.pinned ? '取消置顶' : '置顶'}">${pushpinIconMarkup()}</span><span class="conversation-title" title="${safeTitle}">${safeTitle}</span>`;
  }

  function getConversation(projectId, conversationId) {
    return state.projects.get(projectId)?.conversations.find((item) => item.id === conversationId) || null;
  }

  function getActiveConversationContext() {
    const view = $('[data-testid="conversation-view"]');
    const projectId = view?.dataset.projectId;
    const conversationId = view?.dataset.conversationId;
    return { projectId, conversation: getConversation(projectId, conversationId) };
  }

  function resetConversationTitleEditor() {
    const title = $('[data-testid="conversation-title"]');
    const input = $('[data-testid="conversation-title-input"]');
    if (!title || !input) return;
    title.hidden = false;
    input.hidden = true;
    input.setAttribute('aria-invalid', 'false');
    const error = $('[data-testid="conversation-title-error"]');
    if (error) error.hidden = true;
  }

  function updateConversationTitleValidation() {
    const input = $('[data-testid="conversation-title-input"]');
    const error = $('[data-testid="conversation-title-error"]');
    if (!input || !error) return false;
    const overLimit = input.value !== truncateUserVisibleCharacters(input.value);
    input.setAttribute('aria-invalid', String(overLimit));
    error.hidden = !overLimit;
    return overLimit;
  }

  function startConversationTitleEdit() {
    const { conversation } = getActiveConversationContext();
    const title = $('[data-testid="conversation-title"]');
    const input = $('[data-testid="conversation-title-input"]');
    if (!conversation || !title || !input) return;
    closeConversationShare();
    input.value = conversation.title;
    updateConversationTitleValidation();
    title.hidden = true;
    input.hidden = false;
    input.focus();
    input.select();
  }

  function finishConversationTitleEdit(shouldSave) {
    const title = $('[data-testid="conversation-title"]');
    const input = $('[data-testid="conversation-title-input"]');
    if (!title || !input || input.hidden) return;
    const { projectId, conversation } = getActiveConversationContext();
    if (shouldSave && updateConversationTitleValidation()) return;
    const nextTitle = input.value.trim();
    resetConversationTitleEditor();
    if (!shouldSave || !nextTitle || !conversation) return;
    conversation.title = nextTitle;
    title.textContent = nextTitle;
    title.title = nextTitle;
    syncSidebarConversation(projectId, conversation);
    if (state.projectConversationPageId === projectId) renderProjectConversations(projectId);
    const shareTitle = $('[data-testid="conversation-share-title"]');
    if (shareTitle) shareTitle.textContent = `分享「${nextTitle}」`;
  }

  function syncSidebarConversation(projectId, conversation) {
    const row = $(`[data-sidebar-conversation][data-project-id="${projectId}"][data-conversation-id="${conversation.id}"]`);
    if (!row) return;
    row.dataset.status = conversation.status;
    row.dataset.sidebarOrder = String(conversation.order);
    row.dataset.lastOpened = String(conversation.lastOpened || 0);
    row.classList.toggle('is-running', conversation.status === 'running');
    row.classList.toggle('has-unread', Boolean(conversation.unread));
    row.classList.toggle('is-pinned', Boolean(conversation.pinned));
    row.setAttribute('aria-label', conversation.title);
    row.title = conversation.title;
    const mark = $('.conversation-mark', row);
    mark.textContent = '';
    $('[data-conversation-spinner]', row).hidden = conversation.status !== 'running';
    $('[data-conversation-unread]', row).hidden = conversation.status === 'running' || !conversation.unread;
    const pin = $('[data-conversation-pin]', row);
    pin.setAttribute('aria-label', conversation.pinned ? '取消置顶对话' : '置顶对话');
    pin.title = conversation.pinned ? '取消置顶' : '置顶';
    const title = $('.conversation-title', row);
    title.textContent = conversation.title;
    title.title = conversation.title;
    renderSidebarPinnedItems();
  }

  function getSortedProjectChildren(projectId, root = document) {
    const children = $$(`[data-parent-project-id="${projectId}"]`, root);
    const conversations = children.filter((item) => item.matches('[data-sidebar-conversation]'));
    const otherChildren = children.filter((item) => !item.matches('[data-sidebar-conversation]'));
    conversations.sort((a, b) => {
      const first = getConversation(projectId, a.dataset.conversationId);
      const second = getConversation(projectId, b.dataset.conversationId);
      const pinnedDifference = Number(Boolean(second?.pinned)) - Number(Boolean(first?.pinned));
      if (pinnedDifference) return pinnedDifference;
      if (state.sidebarProjectSort === 'unread') {
        const unreadDifference = Number(Boolean(second?.unread)) - Number(Boolean(first?.unread));
        if (unreadDifference) return unreadDifference;
      }
      if (state.sidebarProjectSort === 'recent') {
        const openedDifference = Number(second?.lastOpened || 0) - Number(first?.lastOpened || 0);
        if (openedDifference) return openedDifference;
      }
      return Number(first?.order || 0) - Number(second?.order || 0);
    });
    return [...conversations, ...otherChildren];
  }

  function sortProjectConversations(projectId) {
    const root = $('[data-sidebar-project-list]');
    const projectButton = $(`[data-sidebar-project][data-project-id="${projectId}"]`, root);
    if (!projectButton) return;
    projectButton.after(...getSortedProjectChildren(projectId, root));
  }

  function toggleConversationPin(row) {
    const conversation = getConversation(row.dataset.projectId, row.dataset.conversationId);
    if (!conversation) return;
    conversation.pinned = !conversation.pinned;
    conversation.pinnedAt = conversation.pinned ? ++state.sidebarPinnedOrderSequence : 0;
    syncSidebarConversation(row.dataset.projectId, conversation);
    sortProjectConversations(row.dataset.projectId);
  }

  function setActiveConversation(id) {
    state.activeConversationId = id || null;
    $$('.project-tree .tree-row').forEach((item) => {
      const selected = item.matches('[data-sidebar-conversation]')
        && item.dataset.conversationId === state.activeConversationId;
      item.classList.toggle('active', selected);
    });
    renderSidebarPinnedItems();
  }

  function openConversation(projectId, conversationId) {
    const project = state.projects.get(projectId);
    const conversation = project?.conversations.find((item) => item.id === conversationId);
    if (!conversation) return;
    const currentConversationId = $('[data-testid="conversation-view"]').dataset.conversationId;
    if (currentConversationId && currentConversationId !== conversationId) {
      setSelectedAsset(null, 'conversation');
      clearComposerReferences('conversation');
    }
    conversation.unread = false;
    conversation.lastOpened = ++state.sidebarConversationOpenSequence;
    syncSidebarConversation(projectId, conversation);
    if (state.sidebarProjectSort === 'recent' || state.sidebarProjectSort === 'unread') sortProjectConversations(projectId);
    markSidebarProjectOpened(projectId);
    selectComposerProject(projectId === 'unbound-project' ? null : projectId);
    renderConversation(project, conversation);
    setActiveConversation(conversationId);
  }

  function renderConversation(project, conversation) {
    resetConversationReplyState();
    setView('conversation');
    $('[data-testid="nav-create"]').classList.add('active');
    resetConversationTitleEditor();
    const title = $('[data-testid="conversation-title"]');
    title.textContent = conversation.title;
    title.title = conversation.title;
    $('[data-testid="conversation-share-title"]').textContent = `分享「${conversation.title}」`;
    renderScheduledConversationStatus(conversation);
    const initialMessage = $('[data-testid="conversation-user-message"]');
    initialMessage.dataset.messageId = `${conversation.id}-initial-user`;
    $('[data-conversation-prompt]').textContent = conversation.prompt;
    initialMessage.hidden = !conversation.prompt;
    const context = $('[data-conversation-context]');
    const pendingModules = conversation.modules?.length
      ? conversation.modules
      : conversation.skill
        ? [{ type: 'skill', name: conversation.skill }]
        : conversation.tool
          ? [{ type: 'tool', name: conversation.tool }]
          : [];
    conversation.initialModules ??= copyComposerModules(pendingModules);
    const contextModules = conversation.initialModules;
    const contextLabel = contextModules
      .map((module) => module.type === 'skill' ? `/${module.name}` : `工具 · ${module.name}`)
      .concat((conversation.references || []).map((reference) => `@${reference.name}`))
      .join(' · ');
    context.textContent = contextLabel;
    context.hidden = !contextLabel;
    $('[data-testid="conversation-thread"]').querySelectorAll('.conversation-message--followup').forEach((item) => item.remove());
    renderConversationFollowups(conversation);
    $('[data-testid="conversation-input"]').value = '';
    $('[data-testid="conversation-view"]').dataset.projectId = project.id;
    $('[data-testid="conversation-view"]').dataset.conversationId = conversation.id;
    replaceComposerModules(pendingModules);
    clearComposerReferences('conversation');
  }

  function renderScheduledConversationStatus(conversation) {
    const status = $('[data-testid="scheduled-conversation-status"]');
    if (!status) return;
    status.hidden = !conversation?.scheduledDraft;
    if (!conversation?.scheduledDraft) {
      status.textContent = '';
      return;
    }
    status.textContent = conversation.scheduledDraft.status === 'confirmed'
      ? '定时任务已创建'
      : '定时任务配置中';
  }

  function closeConversationShare() {
    const trigger = $('[data-action="conversation-share"]');
    const popover = $('[data-testid="conversation-share-popover"]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (popover) popover.hidden = true;
    const copyButton = $('[data-action="copy-conversation-share"]');
    if (copyButton) copyButton.textContent = '复制';
    clearTimeout(state.shareCopyTimer);
    state.shareCopyTimer = null;
  }

  function toggleConversationShare() {
    const trigger = $('[data-action="conversation-share"]');
    const popover = $('[data-testid="conversation-share-popover"]');
    if (!trigger || !popover) return;
    if (!popover.hidden) return closeConversationShare();
    const conversationId = $('[data-testid="conversation-view"]').dataset.conversationId;
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('share', conversationId);
    shareUrl.hash = '';
    $('[data-testid="conversation-share-link"]').value = shareUrl.toString();
    popover.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  }

  async function copyConversationShareLink() {
    const input = $('[data-testid="conversation-share-link"]');
    const button = $('[data-action="copy-conversation-share"]');
    if (!input?.value || !button) return;
    try {
      await navigator.clipboard.writeText(input.value);
    } catch (error) {
      input.focus();
      input.select();
      document.execCommand('copy');
    }
    button.textContent = '已复制';
    showToast('分享链接已复制');
    clearTimeout(state.shareCopyTimer);
    state.shareCopyTimer = setTimeout(() => { button.textContent = '复制'; }, 1800);
  }

  function addProject(type, name, options = {}) {
    const isTeam = type === 'team';
    const root = $(`[data-testid="${isTeam ? 'team' : 'personal'}-projects"]`);
    const empty = $('.project-empty-state', root);
    if (empty) empty.remove();
    const project = document.createElement('article');
    project.className = 'project-folder-card';
    project.dataset.projectItem = '';
    const id = options.id || `project-${state.projectSequence++}`;
    project.dataset.projectId = id;
    project.dataset.projectScope = type;
    project.dataset.projectName = name;
    project.innerHTML = projectCardMarkup(name, options.dateLabel, type);
    root.append(project);
    touchProjectCard(project, true);
    const record = { id, type, name, pinned: false, conversations: [] };
    state.projects.set(id, record);
    addSidebarProject(id, name);
    renderAssetProjectOptions();
    if (!options.silent) {
      closeOverlays();
      selectProjectTab(type);
      filterProjects($('[data-testid="project-search"]').value);
      showToast(`已创建${isTeam ? '团队' : '个人'}项目`);
    }
    return record;
  }

  function closeProjectMoveMenus(except = null) {
    $$('[data-project-move-menu]').forEach((candidate) => {
      if (candidate === except) return;
      candidate.hidden = true;
      $('[data-action="toggle-project-move"]', candidate.closest('[data-project-item]'))?.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleProjectMoveMenu(project) {
    const menu = $('[data-project-move-menu]', project);
    const trigger = $('[data-action="toggle-project-move"]', project);
    const willOpen = menu.hidden;
    closeTransientDropdowns();
    if (willOpen) {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }
  }

  function moveProject(project, targetType) {
    const id = project.dataset.projectId;
    const record = state.projects.get(id);
    if (!record || record.type === targetType) return;
    const sourceRoot = project.parentElement;
    const targetRoot = $(`[data-testid="${targetType === 'team' ? 'team' : 'personal'}-projects"]`);
    const targetEmpty = $('.project-empty-state', targetRoot);
    if (targetEmpty) targetEmpty.remove();
    targetRoot.append(project);
    project.dataset.projectScope = targetType;
    touchProjectCard(project);
    record.type = targetType;
    const nextTarget = targetType === 'team' ? 'personal' : 'team';
    const moveItem = $('[data-move-project-to]', project);
    moveItem.dataset.moveProjectTo = nextTarget;
    moveItem.textContent = `移动到${nextTarget === 'team' ? '团队项目' : '个人项目'}`;
    $('[data-project-move-menu]', project).hidden = true;
    $('[data-action="toggle-project-move"]', project).setAttribute('aria-expanded', 'false');
    if (!$('[data-project-item]', sourceRoot)) {
      const empty = document.createElement('div');
      empty.className = 'project-empty-state';
      empty.textContent = sourceRoot.dataset.testid === 'team-projects' ? '暂无团队项目' : '暂无个人项目';
      sourceRoot.append(empty);
    }
    selectProjectTab(targetType);
    filterProjects($('[data-testid="project-search"]').value);
    renderAssetProjectOptions();
    showToast(`已移动到${targetType === 'team' ? '团队项目' : '个人项目'}`);
  }

  function ensureUnboundProject() {
    return state.projects.get('unbound-project') || addProject('personal', '未分类项目', {
      id: 'unbound-project',
      dateLabel: '刚刚',
      silent: true
    });
  }

  function setProjectExpanded(projectId, expanded) {
    const projectButton = $(`[data-sidebar-project][data-project-id="${projectId}"]`);
    if (!projectButton) return;
    projectButton.setAttribute('aria-expanded', String(expanded));
    const pinned = isSidebarProjectPinned(projectId);
    $$(`[data-parent-project-id="${projectId}"]`).forEach((item) => {
      item.hidden = pinned || (state.sidebarProjectGroup === 'project' ? !expanded : item.matches('[data-project-directory]'));
    });
  }

  function setActiveProjectTreeRow(target) {
    state.activeConversationId = null;
    $$('.project-tree .tree-row').forEach((row) => row.classList.toggle('active', row === target));
    renderSidebarPinnedItems();
  }

  function showProjectOverview(projectType = 'personal') {
    $('[data-testid="project-directory-view"]').hidden = true;
    $('[data-testid="project-conversations-view"]').hidden = true;
    state.projectConversationPageId = null;
    updateProjectConversationBackButton();
    $('.project-toolbar').hidden = false;
    selectProjectTab(projectType);
  }

  function renderProjectConversations(projectId) {
    const project = state.projects.get(projectId);
    const list = $('[data-testid="project-conversation-list"]');
    if (!project || !list) return;
    const conversations = [...project.conversations].sort((first, second) => {
      const pinnedDifference = Number(Boolean(second.pinned)) - Number(Boolean(first.pinned));
      return pinnedDifference || Number(second.lastOpened || second.order || 0) - Number(first.lastOpened || first.order || 0);
    });
    list.innerHTML = conversations.length
      ? conversations.map((conversation) => `
        <button class="project-conversation-item${conversation.unread ? ' is-unread' : ''}" type="button" data-action="open-project-conversation" data-project-id="${escapeHtml(project.id)}" data-conversation-id="${escapeHtml(conversation.id)}" aria-label="打开项目对话 ${escapeHtml(conversation.title)}">
          <span class="project-conversation-icon" aria-hidden="true">对</span>
          <span class="project-conversation-copy"><strong title="${escapeHtml(conversation.title)}">${escapeHtml(conversation.title)}</strong><small>${escapeHtml(conversation.createdAt || '项目子对话')}</small></span>
          ${conversation.unread ? '<span class="project-conversation-unread" aria-label="未读"></span>' : ''}
        </button>`).join('')
      : '<div class="project-conversation-empty">当前项目还没有子对话</div>';
  }

  function openProjectConversationPage(projectId) {
    const project = state.projects.get(projectId);
    const sidebarProject = $(`[data-sidebar-project][data-project-id="${projectId}"]`);
    if (!project || !project.conversations.length) return focusSidebarProject(projectId);
    setView('projects');
    state.projectConversationPageId = projectId;
    updateProjectConversationBackButton();
    selectLibraryTab('projects');
    selectProjectTab(project.type);
    setProjectExpanded(projectId, true);
    setActiveProjectTreeRow(sidebarProject);
    $('.project-toolbar').hidden = true;
    $$('[data-project-panel]').forEach((panel) => { panel.hidden = true; });
    $('[data-testid="project-directory-view"]').hidden = true;
    const view = $('[data-testid="project-conversations-view"]');
    view.hidden = false;
    $('[data-project-conversations-project]').textContent = project.name;
    $('[data-project-conversations-title]').textContent = `${project.name}的子对话`;
    renderProjectConversations(projectId);
  }

  function focusSidebarProject(projectId) {
    const project = state.projects.get(projectId);
    if (!project) return;
    const projectButton = $(`[data-sidebar-project][data-project-id="${projectId}"]`);
    touchProjectCard($(`[data-project-item][data-project-id="${projectId}"]`));
    const treeToggle = $('[data-action="toggle-projects"]');
    if (treeToggle.getAttribute('aria-expanded') === 'false') {
      treeToggle.setAttribute('aria-expanded', 'true');
      $('[data-sidebar-project-list]').hidden = false;
    }
    setView('projects');
    selectLibraryTab('projects');
    showProjectOverview(project.type);
    setProjectExpanded(projectId, true);
    setActiveProjectTreeRow(projectButton);
    projectButton.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function toggleSidebarProject(projectId) {
    const projectButton = $(`[data-sidebar-project][data-project-id="${projectId}"]`);
    const wasExpanded = projectButton?.getAttribute('aria-expanded') === 'true';
    if (!projectButton) return;
    setProjectExpanded(projectId, !wasExpanded);
    projectButton.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function openProjectDirectory(projectId, directoryName, trigger) {
    const project = state.projects.get(projectId);
    if (!project) return;
    setView('projects');
    selectLibraryTab('projects');
    selectProjectTab(project.type);
    setProjectExpanded(projectId, true);
    setActiveProjectTreeRow(trigger);
    $('.project-toolbar').hidden = true;
    $$('[data-project-panel]').forEach((panel) => { panel.hidden = true; });
    $('[data-testid="project-conversations-view"]').hidden = true;
    state.projectConversationPageId = null;
    updateProjectConversationBackButton();
    const view = $('[data-testid="project-directory-view"]');
    view.hidden = false;
    $('[data-project-directory-project]').textContent = project.name;
    $('[data-project-directory-breadcrumb]').textContent = directoryName;
    $('[data-project-directory-title]').textContent = directoryName;
    $$('[data-project-file]', view).forEach((item) => {
      item.hidden = Boolean(item.dataset.projectId) && item.dataset.projectId !== projectId;
    });
    const firstEntry = $('[data-project-file]:not([hidden])', view);
    if (firstEntry) selectProjectFile(firstEntry);
  }

  function selectProjectFile(button) {
    const content = {
      overview: ['项目说明.md', '这里展示项目目标、协作方式与使用说明，可直接带入创作对话。'],
      assets: ['素材清单', '查看当前项目引用的图片、音频、视频和文案素材。'],
      history: ['更新记录.md', '查看项目内容、目录结构与协作状态的最近变更。']
    }[button.dataset.projectFile] || [button.dataset.previewTitle, button.dataset.previewCopy];
    $$('[data-project-file]').forEach((item) => item.classList.toggle('active', item === button));
    $('[data-project-entry-preview-title]').textContent = content[0];
    $('[data-project-entry-preview-copy]').textContent = content[1];
  }

  function createProjectEntry() {
    const sequence = ++state.projectEntrySequence;
    const name = `新建页面 ${sequence}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.projectId = $('.project-tree .tree-row.active')?.dataset.projectId || '';
    button.dataset.projectFile = `custom-${sequence}`;
    button.dataset.previewTitle = name;
    button.dataset.previewCopy = '这是新建的项目内容页面，可继续用于整理资料或发起创作。';
    button.innerHTML = `<span class="project-entry-icon">页</span><span><strong>${name}</strong><small>刚刚创建的项目内容</small></span>`;
    $('[data-testid="project-entry-list"]').append(button);
    selectProjectFile(button);
    showToast(`已创建「${name}」`);
  }

  function useProjectEntry() {
    const activeTreeItem = $('.project-tree .tree-row.active');
    const projectId = activeTreeItem?.dataset.projectId;
    const project = state.projects.get(projectId);
    if (!project) return;
    const entryName = $('[data-project-entry-preview-title]').textContent;
    selectComposerProject(projectId);
    setView('create');
    setPrompt(`请基于「${project.name} / ${entryName}」中的内容开始创作：`);
  }

  function createConversation(prompt, options = {}) {
    const project = options.projectId
      ? state.projects.get(options.projectId)
      : state.selectedProjectId
      ? state.projects.get(state.selectedProjectId)
      : ensureUnboundProject();
    if (!project) return null;
    const sequence = ++state.conversationSequence;
    const conversation = {
      id: `conversation-${sequence}`,
      title: options.title || prompt || '新建对话',
      prompt,
      tool: state.selectedTool,
      skill: state.selectedSkill,
      modules: copyComposerModules(state.selectedModules),
      initialModules: copyComposerModules(state.selectedModules),
      references: copyComposerReferences(state.selectedReferences.home),
      createdAt: options.createdAt || new Date().toLocaleString('zh-CN', {
        year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      status: options.status || 'complete',
      unread: false,
      pinned: false,
      order: sequence,
      lastOpened: ++state.sidebarConversationOpenSequence,
      followups: [],
      pendingFollowup: null,
      completionTimer: null,
      scheduledDraft: options.scheduledDraft || null
    };
    if (options.followups) conversation.followups = options.followups.map((entry) => ({ ...entry }));
    project.conversations.push(conversation);
    addSidebarConversation(project.id, conversation);
    setProjectExpanded(project.id, true);
    renderConversation(project, conversation);
    setActiveConversation(conversation.id);
    return conversation;
  }

  function createConversationInProject(projectId) {
    const project = state.projects.get(projectId);
    if (!project) return;
    selectComposerProject(projectId);
    markSidebarProjectOpened(projectId);
    createConversation('', { projectId, title: '新建对话' });
    setProjectExpanded(projectId, true);
    setTimeout(() => $('[data-testid="conversation-input"]').focus(), 0);
  }

  function completeConversation(projectId, conversationId) {
    const conversation = getConversation(projectId, conversationId);
    if (!conversation) return;
    conversation.completionTimer = null;
    conversation.status = 'complete';
    conversation.unread = !(state.view === 'conversation' && state.activeConversationId === conversationId);
    syncSidebarConversation(projectId, conversation);
    sortProjectConversations(projectId);
  }

  function submitConversation(prompt) {
    if (state.submitInProgress) return;
    closeCommandMenu();
    $('[data-testid="prompt-input"]').value = '';
    state.homeComposerTextSlots = [''];
    state.homeComposerTextSlot = null;
    state.submitInProgress = true;
    const submit = $('[data-testid="submit-button"]');
    submit.disabled = true;
    submit.textContent = '创作中';
    submit.classList.add('is-loading');
    clearTimeout(state.submitResetTimer);
    const selectedProjectId = state.selectedProjectId;
    const conversation = createConversation(prompt, { status: 'running' });
    clearComposerReferences('home');
    const projectId = selectedProjectId || 'unbound-project';
    startConversationReply(projectId, conversation.id, prompt, conversation.modules);
    conversation.completionTimer = setTimeout(() => completeConversation(projectId, conversation.id), realTaskDurationMs);
    state.submitResetTimer = setTimeout(() => {
      state.submitInProgress = false;
      submit.disabled = false;
      submit.textContent = '立即创作';
      submit.classList.remove('is-loading');
    }, submitFeedbackDurationMs);
  }

  function showConversationHoverCard(row) {
    const conversation = getConversation(row.dataset.projectId, row.dataset.conversationId);
    const card = $('[data-testid="conversation-hover-card"]');
    if (!conversation || !card) return;
    $('[data-conversation-hover-title]', card).textContent = conversation.title;
    $('[data-conversation-hover-time]', card).textContent = conversation.createdAt;
    $('[data-conversation-hover-prompt]', card).textContent = conversation.prompt;
    card.hidden = false;
    const rowRect = row.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const left = Math.min(rowRect.right + 10, window.innerWidth - cardRect.width - 12);
    const top = Math.max(12, Math.min(rowRect.top, window.innerHeight - cardRect.height - 12));
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
    card.dataset.projectId = row.dataset.projectId;
    card.dataset.conversationId = row.dataset.conversationId;
  }

  function hideConversationHoverCard() {
    const card = $('[data-testid="conversation-hover-card"]');
    if (card) card.hidden = true;
  }

  function sendConversationFollowup() {
    const input = $('[data-testid="conversation-input"]');
    const message = state.selectedModules.length
      ? getConversationComposerText()
      : input.value.trim();
    const view = $('[data-testid="conversation-view"]');
    const projectId = view.dataset.projectId;
    const conversationId = view.dataset.conversationId;
    const conversation = getConversation(projectId, conversationId);
    if (!message || !conversation || conversation.pendingFollowup) return;
    closeCommandMenu();
    clearTimeout(conversation.completionTimer);
    conversation.completionTimer = null;
    const invocationModules = copyComposerModules(state.selectedModules);
    const invocationReferences = copyComposerReferences(state.selectedReferences.conversation);
    conversation.modules = copyComposerModules(invocationModules);
    conversation.skill = state.selectedSkill;
    conversation.tool = state.selectedTool;
    conversation.followups.push({
      role: 'user',
      text: message,
      skill: state.selectedSkill,
      tool: state.selectedTool,
      modules: copyComposerModules(invocationModules),
      asset: state.conversationAsset,
      references: copyComposerReferences(invocationReferences)
    });
    conversation.pendingFollowup = { message, modules: copyComposerModules(invocationModules) };
    conversation.status = 'running';
    conversation.unread = false;
    syncSidebarConversation(projectId, conversation);
    input.value = '';
    clearComposerModules(null, false);
    state.conversationModuleTextSlots = [''];
    state.conversationModuleTextSlot = null;
    setSelectedAsset(null, 'conversation');
    clearComposerReferences('conversation');
    if (conversation.scheduledDraft && conversation.scheduledDraft.status !== 'confirmed') {
      processScheduledDraftMessage(projectId, conversation, message);
      renderConversationFollowups(conversation);
      renderScheduledConversationStatus(conversation);
      scrollConversationToLatest();
      return;
    }
    renderConversationFollowups(conversation);
    setConversationReplyInProgress(true);
    scrollConversationToLatest();
    startConversationFollowupJob(projectId, conversationId, message, invocationModules);
  }

  function appendConversationModuleRuns(article, modules = []) {
    if (!modules.length) return;
    const runList = document.createElement('ol');
    runList.className = 'conversation-module-runs';
    runList.dataset.testid = 'conversation-module-runs';
    runList.setAttribute('aria-label', '本次调用的功能模块');
    modules.forEach((module) => {
      const item = document.createElement('li');
      item.dataset.testid = 'conversation-module-run';
      item.dataset.moduleType = module.type;
      const name = document.createElement('strong');
      name.textContent = module.name;
      const status = document.createElement('span');
      status.textContent = '已调用';
      item.append(name, status);
      runList.append(item);
    });
    article.append(runList);
  }

  function renderConversationFollowups(conversation) {
    const thread = $('[data-testid="conversation-thread"]');
    thread.querySelectorAll('.conversation-message--followup').forEach((item) => item.remove());
    ensureConversationMessageIds(conversation);
    (conversation.followups || []).forEach((entry) => {
      const article = document.createElement('article');
      article.className = `conversation-message conversation-message--${entry.role} conversation-message--followup`;
      article.dataset.messageId = entry.id;
      if (entry.role === 'assistant') {
        article.dataset.testid = 'conversation-assistant-reply';
        const label = document.createElement('span');
        label.textContent = 'Agent';
        article.append(label);
      }
      if (entry.type === 'scheduled-confirmation') {
        const draft = conversation.scheduledDraft;
        const projectName = state.projects.get(draft.projectId)?.name || '未分类项目';
        const card = document.createElement('section');
        card.className = 'scheduled-confirmation-card';
        card.dataset.testid = 'scheduled-task-confirmation';
        card.innerHTML = `<strong>请确认定时任务</strong><dl class="scheduled-confirmation-grid"><div><dt>任务</dt><dd>${escapeHtml(draft.title)}</dd></div><div><dt>运行目标</dt><dd>${escapeHtml(draft.runTask)}</dd></div><div><dt>目录</dt><dd>${escapeHtml(projectName)}</dd></div><div><dt>频率</dt><dd>${escapeHtml(draft.repeat)}</dd></div><div><dt>时间</dt><dd>${escapeHtml(draft.time)}</dd></div><div><dt>通知</dt><dd>${escapeHtml(draft.notification)}</dd></div><div><dt>通知方式</dt><dd>${escapeHtml(draft.notificationChannel)}</dd></div></dl><div class="scheduled-confirmation-actions"><button type="button" data-action="confirm-scheduled-chat-task">确认创建</button></div>`;
        article.append(card);
        thread.append(article);
        return;
      }
      if (entry.type === 'scheduled-created') {
        const card = document.createElement('section');
        card.className = 'scheduled-created-card';
        card.dataset.testid = 'scheduled-task-created-message';
        card.innerHTML = '<p>定时任务已创建，任务已进入列表并开始运行。</p><button type="button" data-action="view-scheduled-tasks">查看任务</button>';
        article.append(card);
        thread.append(article);
        return;
      }
      const paragraph = document.createElement('p');
      if (entry.role === 'user' && entry.references?.length) {
        const references = document.createElement('span');
        references.className = 'conversation-message-references';
        references.dataset.testid = 'conversation-message-references';
        references.textContent = entry.references.map((reference) => `@${reference.name}`).join(' · ');
        article.append(references);
      }
      paragraph.textContent = entry.text;
      article.append(paragraph);
      if (entry.role === 'assistant') appendConversationModuleRuns(article, entry.modules);
      thread.append(article);
    });
    if (conversation.pendingFollowup) {
      const thinking = document.createElement('article');
      thinking.className = 'conversation-message conversation-message--assistant conversation-message--followup conversation-message--thinking';
      thinking.dataset.testid = 'conversation-thinking';
      thinking.innerHTML = '<span>Agent</span><p>Agent 正在思考…</p>';
      thread.append(thinking);
    }
    setConversationReplyInProgress(Boolean(conversation.pendingFollowup));
  }

  function startConversationFollowupJob(projectId, conversationId, message, modules = []) {
    const jobKey = `${projectId}:${conversationId}`;
    clearTimeout(state.conversationReplyJobs.get(jobKey));
    const timer = setTimeout(() => {
      state.conversationReplyJobs.delete(jobKey);
      const conversation = getConversation(projectId, conversationId);
      if (!conversation || !conversation.pendingFollowup) return;
      conversation.followups.push({
        role: 'assistant',
        text: `已收到你的消息：“${message}”。这是模拟回复，我会根据这段输入继续整理目标、步骤和可执行结果。`,
        modules: copyComposerModules(modules)
      });
      conversation.pendingFollowup = null;
      conversation.status = 'complete';
      const activeView = $('[data-testid="conversation-view"]');
      const isActive = state.view === 'conversation'
        && activeView.dataset.projectId === projectId
        && activeView.dataset.conversationId === conversationId;
      conversation.unread = !isActive;
      syncSidebarConversation(projectId, conversation);
      sortProjectConversations(projectId);
      if (isActive) {
        renderConversationFollowups(conversation);
        scrollConversationToLatest();
      }
    }, 800);
    state.conversationReplyJobs.set(jobKey, timer);
  }

  function startConversationReply(projectId, conversationId, message, modules = []) {
    const thread = $('[data-testid="conversation-thread"]');
    setConversationReplyInProgress(true);

    const thinking = document.createElement('article');
    thinking.className = 'conversation-message conversation-message--assistant conversation-message--followup conversation-message--thinking';
    thinking.dataset.testid = 'conversation-thinking';
    thinking.innerHTML = '<span>Agent</span><p>Agent 正在思考…</p>';
    thread.append(thinking);
    scrollConversationToLatest();

    state.conversationReplyTimer = setTimeout(() => {
      thinking.remove();
      const conversation = getConversation(projectId, conversationId);
      if (!conversation) return;
      conversation.followups.push({
        role: 'assistant',
        text: `已收到你的消息：“${message}”。这是模拟回复，我会根据这段输入继续整理目标、步骤和可执行结果。`,
        modules: copyComposerModules(modules)
      });
      renderConversationFollowups(conversation);
      state.conversationReplyTimer = null;
      setConversationReplyInProgress(false);
      scrollConversationToLatest();
    }, 1200);
  }

  function setConversationReplyInProgress(inProgress) {
    state.conversationReplyInProgress = inProgress;
    const send = $('[data-action="conversation-send"]');
    send.disabled = inProgress;
    send.classList.toggle('is-loading', inProgress);
    send.setAttribute('aria-busy', String(inProgress));
  }

  function resetConversationReplyState() {
    clearTimeout(state.conversationReplyTimer);
    state.conversationReplyTimer = null;
    $('[data-testid="conversation-thinking"]')?.remove();
    setConversationReplyInProgress(false);
  }

  function scrollConversationToLatest() {
    const thread = $('[data-testid="conversation-thread"]');
    requestAnimationFrame(() => thread.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' }));
  }

  function updateProjectDialogSubmit() {
    const input = $('[data-testid="project-name-input"]');
    const error = $('[data-testid="project-name-error"]');
    const overLimit = input.value !== truncateUserVisibleCharacters(input.value);
    input.setAttribute('aria-invalid', String(overLimit));
    error.hidden = !overLimit;
    $('[data-action="submit-project"]').disabled = !input.value.trim() || overLimit;
  }

  function openProjectDialog(type, renameTarget = null, source = null) {
    state.projectDraftType = type;
    state.projectRenameTarget = renameTarget;
    state.projectDialogSource = source;
    closeOverlays();
    const isRename = Boolean(renameTarget);
    const isTeam = type === 'team';
    const input = $('[data-testid="project-name-input"]');
    $('[data-project-dialog-title]').textContent = isRename ? '重命名项目' : `新建${isTeam ? '团队' : '个人'}项目`;
    $('[data-project-dialog-note]').innerHTML = isTeam
      ? '<span aria-hidden="true">ⓘ</span><span>团队项目用于邀请其他用户共同协作并共享项目资产（团队负责人可创建项目，如需创建请联系管理员）</span>'
      : '<span aria-hidden="true">ⓘ</span><span>个人项目仅自己可见，创建后仍可修改项目名称</span>';
    $('[data-action="submit-project"]').textContent = isRename ? '保存' : '创建项目';
    input.value = isRename ? renameTarget.dataset.projectName : '';
    $('[data-testid="project-dialog"]').hidden = false;
    updateProjectDialogSubmit();
    setTimeout(() => { input.focus(); if (isRename) input.select(); }, 0);
  }

  function closeProjectDialog({ restoreFocus = true } = {}) {
    const shouldRestorePickerFocus = restoreFocus && state.projectDialogSource === 'project-picker';
    $('[data-testid="project-dialog"]').hidden = true;
    state.projectRenameTarget = null;
    state.projectDialogSource = null;
    $('[data-testid="project-name-input"]').value = '';
    updateProjectDialogSubmit();
    if (shouldRestorePickerFocus) setTimeout(() => $('[data-testid="project-picker-trigger"]').focus(), 0);
  }

  function submitProjectDialog() {
    const input = $('[data-testid="project-name-input"]');
    if (input.value !== truncateUserVisibleCharacters(input.value)) {
      updateProjectDialogSubmit();
      return;
    }
    const name = input.value.trim();
    if (!name) return;
    if (state.projectRenameTarget) {
      const project = state.projectRenameTarget;
      const record = state.projects.get(project.dataset.projectId);
      project.dataset.projectName = name;
      const projectCardName = $('.folder-card-info strong', project);
      projectCardName.textContent = name;
      projectCardName.title = name;
      $('.project-open-button', project).setAttribute('aria-label', `打开 ${name}`);
      $('.project-rename-button', project).setAttribute('aria-label', `重命名 ${name}`);
      $('.project-move-button', project).setAttribute('aria-label', `移动 ${name}`);
      const sidebarProject = $(`[data-sidebar-project][data-project-id="${project.dataset.projectId}"]`);
      if (sidebarProject) {
        sidebarProject.dataset.projectName = name;
        sidebarProject.title = name;
        const sidebarProjectName = $('.tree-project-name', sidebarProject);
        sidebarProjectName.textContent = name;
        sidebarProjectName.title = name;
        $('[data-action="new-project-conversation"]', sidebarProject).setAttribute('aria-label', `在${name}中创建对话`);
        $('[data-action="toggle-sidebar-project-menu"]', sidebarProject).setAttribute('aria-label', `${name} 的项目操作`);
        const pin = $('[data-action="toggle-project-pin"]', sidebarProject);
        pin.setAttribute('aria-label', `${record?.pinned ? '取消置顶' : '置顶'}项目 ${name}`);
      }
      if (record) record.name = name;
      renderSidebarPinnedItems();
      touchProjectCard(project);
      if (state.selectedProjectId === project.dataset.projectId) $('[data-selected-project-label]').textContent = name;
      closeProjectDialog();
      filterProjects($('[data-testid="project-search"]').value);
      renderAssetProjectOptions();
      return showToast('项目名称已更新');
    }
    const type = state.projectDraftType;
    const source = state.projectDialogSource;
    closeProjectDialog({ restoreFocus: false });
    const project = addProject(type, name);
    if (source === 'project-picker') selectComposerProject(project.id);
  }

  function setUploadDialog(open, mode = state.skillDialogMode) {
    state.skillDialogMode = mode;
    const isCreate = mode === 'create';
    $('[data-skill-dialog-title]').textContent = isCreate ? '创建 Skill' : '导入 Skill';
    $('[data-skill-dialog-description]').textContent = isCreate
      ? '填写基础信息，创建一个 Skill 并保存到“我的 Skill”。'
      : '导入本地 Skill 配置并保存到“我的 Skill”。';
    $('[data-testid="skill-dialog-submit"]').textContent = isCreate ? '创建' : '导入';
    clearSkillImportFile();
    renderSkillImportFile();
    $('[data-testid="upload-skill-dialog"]').hidden = !open;
    if (open) setTimeout(() => $('[data-testid="skill-name-input"]').focus(), 0);
  }

  const supportedSkillFileExtensions = new Set(['zip', 'json', 'yaml', 'yml', 'md']);

  function formatSkillFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function renderSkillImportFile() {
    const section = $('[data-skill-file-section]');
    const selected = $('[data-skill-file-selected]');
    const empty = $('[data-skill-file-empty]');
    const error = $('[data-skill-file-error]');
    const submit = $('[data-testid="skill-dialog-submit"]');
    const isImport = state.skillDialogMode === 'import';
    const hasFile = Boolean(state.skillImportFile);
    section.hidden = !isImport;
    empty.hidden = hasFile;
    selected.hidden = !hasFile;
    error.hidden = !state.skillImportError;
    error.textContent = state.skillImportError;
    submit.disabled = isImport && !hasFile;
    if (!hasFile) return;
    $('[data-testid="skill-file-name"]').textContent = state.skillImportFile.name;
    $('[data-testid="skill-file-size"]').textContent = formatSkillFileSize(state.skillImportFile.size);
  }

  function clearSkillImportFile() {
    state.skillImportFile = null;
    state.skillImportError = '';
    const input = $('[data-testid="skill-file-input"]');
    if (input) input.value = '';
    const section = $('[data-skill-file-section]');
    if (section) section.classList.remove('is-dragging');
    if (section) renderSkillImportFile();
  }

  function setSkillImportFile(file) {
    const extension = file?.name.split('.').pop()?.toLowerCase() || '';
    if (!file || !supportedSkillFileExtensions.has(extension)) {
      state.skillImportFile = null;
      state.skillImportError = '不支持此文件格式，请选择 .zip、.json、.yaml、.yml 或 .md 文件';
      $('[data-testid="skill-file-input"]').value = '';
      renderSkillImportFile();
      return;
    }
    state.skillImportFile = file;
    state.skillImportError = '';
    renderSkillImportFile();
  }

  function saveLocalSkill() {
    const input = $('[data-testid="skill-name-input"]');
    if (state.skillDialogMode === 'import' && !state.skillImportFile) return;
    const name = input.value.trim() || '未命名本地 Skill';
    state.installedSkills.add(name);
    renderInstalledSkills();
    setUploadDialog(false);
    selectCapabilityTab('skills');
    selectSkillTab('mine');
    input.value = '';
    showToast(state.skillDialogMode === 'create' ? 'Skill 已创建' : 'Skill 已导入');
  }

  function handleAction(action, target) {
    if (['model', 'skill', 'add', 'account', 'account-login', 'project-picker', 'sidebar-project-filter'].includes(action)) return setOverlay(action, target);
    if (action === 'remove-composer-reference') {
      return removeComposerReference(target.dataset.referenceSurface, target.dataset.composerReference);
    }
    if (action === 'close-account-notifications') return closeOverlays();
    if (action === 'close-account-login') return closeOverlays();
    if (action === 'logout-account') return logoutAccount();
    if (action === 'select-login-account') return loginAccount(target.dataset.accountId);
    if (action === 'mark-all-notifications-read') return markAllNotificationsRead();
    if (action === 'new-personal-project') return openProjectDialog('personal');
    if (action === 'create-project-from-picker') return openProjectDialog('personal', null, 'project-picker');
    if (action === 'upload-local-materials') {
      state.materialTarget = composerSurfaceFor(target);
      closeOverlays();
      return $('[data-testid="local-folder-input"]').click();
    }
    if (action === 'open-asset-picker') {
      state.materialTarget = composerSurfaceFor(target);
      return openAssetPicker();
    }
    if (action === 'open-knowledge-picker') {
      state.materialTarget = composerSurfaceFor(target);
      return openKnowledgePicker();
    }
    if (action === 'close-asset-picker') return closeAssetPicker();
    if (action === 'confirm-asset-picker') return confirmAssetPicker();
    if (action === 'close-knowledge-picker') return closeKnowledgePicker();
    if (action === 'select-knowledge-picker-space') return selectKnowledgePickerSpace(target.dataset.knowledgePickerSpace);
    if (action === 'toggle-knowledge-picker-item') return toggleKnowledgePickerItem(target);
    if (action === 'confirm-knowledge-picker') return confirmKnowledgePicker();
    if (action === 'toggle-all-models') return toggleAllModels();
    if (action === 'search') {
      const panel = $('[data-testid="search-panel"]');
      const trigger = $('[data-testid="search-trigger"]');
      const willOpen = panel.hidden;
      closeTransientDropdowns();
      if (willOpen) {
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        const input = $('[data-testid="search-input"]');
        input.value = state.globalSearchQuery;
        renderGlobalSearchResults();
        input.focus();
      }
      return;
    }
    if (action === 'collapse') {
      const collapsed = document.body.classList.toggle('sidebar-collapsed');
      const label = collapsed ? '展开侧边栏' : '收起侧边栏';
      $$('[data-action="collapse"]').forEach((trigger) => {
        trigger.setAttribute('aria-label', label);
        trigger.setAttribute('title', label);
      });
      return;
    }
    if (action === 'toggle-projects') {
      const button = $('[data-action="toggle-projects"]');
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      $('.tree-children').hidden = expanded;
      return;
    }
    if (action === 'submit') {
      const prompt = getHomeComposerText();
      if (!prompt) return showToast('请先输入创作内容');
      return submitConversation(prompt);
    }
    if (action === 'conversation-back') return setView('create');
    if (action === 'conversation-send') return sendConversationFollowup();
    if (action === 'rename-conversation-title') return startConversationTitleEdit();
    if (action === 'confirm-scheduled-chat-task') return confirmScheduledTaskFromConversation();
    if (action === 'view-scheduled-tasks') return setView('scheduled-tasks');
    if (action === 'conversation-share') return toggleConversationShare();
    if (action === 'copy-conversation-share') return copyConversationShareLink();
    if (action === 'new-project-conversation') {
      return createConversationInProject(target.closest('[data-sidebar-project]')?.dataset.projectId);
    }
    if (action === 'toggle-sidebar-project-menu') {
      return toggleSidebarProjectActionMenu(target.closest('[data-sidebar-project]')?.dataset.projectId);
    }
    if (action === 'toggle-project-pin') {
      return toggleProjectPin(target.closest('[data-sidebar-project]')?.dataset.projectId || state.projectActionTargetId);
    }
    if (action === 'toggle-pinned-project') return togglePinnedProject(target.dataset.projectId);
    if (action === 'new-pinned-project-conversation') {
      const project = state.projects.get(target.dataset.projectId);
      if (project?.pinned) project.pinnedExpanded = true;
      return createConversationInProject(target.dataset.projectId);
    }
    if (action === 'unpin-pinned-project') return toggleProjectPin(target.dataset.projectId);
    if (action === 'open-pinned-conversation') return openConversation(target.dataset.projectId, target.dataset.conversationId);
    if (action === 'unpin-pinned-conversation') {
      const row = $(`[data-sidebar-conversation][data-project-id="${target.dataset.projectId}"][data-conversation-id="${target.dataset.conversationId}"]`);
      if (row) return toggleConversationPin(row);
    }
    if (action === 'rename-sidebar-project') {
      const projectId = state.projectActionTargetId;
      const record = state.projects.get(projectId);
      const project = $(`[data-project-item][data-project-id="${projectId}"]`);
      closeSidebarProjectActionMenu();
      if (record && project) return openProjectDialog(record.type, project);
    }
    if (action === 'open-project-delete') {
      const projectId = state.projectActionTargetId;
      return openProjectDeleteDialog(projectId);
    }
    if (action === 'close-project-delete') return closeProjectDeleteDialog();
    if (action === 'delete-project-folder-only') return deleteProject(state.projectDeleteTargetId, true);
    if (action === 'delete-project-with-content') return deleteProject(state.projectDeleteTargetId, false);
    if (action === 'toggle-conversation-pin') return toggleConversationPin(target.closest('[data-sidebar-conversation]'));
    if (action === 'run-installed-skill') return runInstalledSkill(target.dataset.skillName);
    if (action === 'explore-skills') {
      setView('skills');
      selectCapabilityTab('skills');
      return selectSkillTab('plaza');
    }
    if (action === 'upload-skill' || action === 'import-skill') return setUploadDialog(true, 'import');
    if (action === 'create-skill') return;
    if (action === 'close-upload') return setUploadDialog(false);
    if (action === 'choose-skill-file') return $('[data-testid="skill-file-input"]').click();
    if (action === 'remove-skill-file') return clearSkillImportFile();
    if (action === 'save-skill') return saveLocalSkill();
    if (action === 'close-project-dialog') return closeProjectDialog();
    if (action === 'submit-project') return submitProjectDialog();
    if (action === 'rename-project') {
      const project = target.closest('[data-project-item]');
      const type = project.closest('[data-project-panel]').dataset.projectPanel;
      return openProjectDialog(type, project);
    }
    if (action === 'toggle-project-move') return toggleProjectMoveMenu(target.closest('[data-project-item]'));
    if (action === 'move-project') return moveProject(target.closest('[data-project-item]'), target.dataset.moveProjectTo);
    if (action === 'open-project') {
      const project = target.closest('[data-project-item]');
      const projectId = project?.dataset.projectId;
      return state.projects.get(projectId)?.conversations.length
        ? openProjectConversationPage(projectId)
        : focusSidebarProject(projectId);
    }
    if (action === 'project-conversations-back') {
      return focusSidebarProject(state.projectConversationPageId || 'project-guide');
    }
    if (action === 'new-project-conversation-page') {
      return createConversationInProject(state.projectConversationPageId);
    }
    if (action === 'open-project-conversation') {
      return openConversation(target.dataset.projectId, target.dataset.conversationId);
    }
    if (action === 'project-directory-back') {
      const activeTreeItem = $('.project-tree .tree-row.active');
      return focusSidebarProject(activeTreeItem?.dataset.projectId || 'project-guide');
    }
    if (action === 'new-project-entry') return createProjectEntry();
    if (action === 'use-project-entry') return useProjectEntry();
    if (action === 'scheduled-create-menu') return setOverlay('scheduled-create');
    if (action === 'scheduled-create-chat') return createScheduledTaskFromChat();
    if (action === 'scheduled-create-manual') return openScheduledTaskDrawer();
    if (action === 'close-scheduled-drawer') return closeScheduledTaskDrawer();
    if (action === 'toggle-scheduled-select') return toggleScheduledSelect(target);
    if (action === 'select-scheduled-option') return selectScheduledOption(target);
    if (action === 'toggle-scheduled-time-picker') return toggleScheduledTimePicker(target);
    if (action === 'select-scheduled-time') return selectScheduledTimePart(target);
    if (action === 'save-scheduled-task') return saveScheduledTask();
    if (action === 'edit-scheduled-task') return editScheduledTask(target);
    if (action === 'toggle-scheduled-task') return toggleScheduledTask(target);
    if (action === 'toggle-resource-nav') return setResourceNavExpanded($('[data-testid="resource-nav-children"]').hidden);
    if (action === 'new-knowledge-folder') {
      if (!canCreateKnowledgeFolder()) return showToast('联系管理员新建');
      return openKnowledgeDialog('folder');
    }
    if (action === 'toggle-knowledge-row-menu') return toggleKnowledgeRowMenu(target.closest('[data-knowledge-row]'));
    if (action === 'knowledge-row-operation') return operateKnowledgeRow(target);
    if (action === 'close-knowledge-item-dialog') return closeKnowledgeItemDialog();
    if (action === 'submit-knowledge-item-dialog') return submitKnowledgeItemDialog();
    if (action === 'open-knowledge-detail') return openKnowledgeDetail(target.closest('[data-knowledge-row]'));
    if (action === 'close-knowledge-detail') return closeKnowledgeDetail();
    if (action === 'add-knowledge-content') return openKnowledgeDialog('content');
    if (action === 'close-knowledge-dialog') return closeKnowledgeDialog();
    if (action === 'submit-knowledge-dialog') return submitKnowledgeDialog();
    if (action === 'knowledge-upload-local') return $('[data-testid="knowledge-local-file-input"]').click();
    if (action === 'knowledge-online-platform') return showToast('在线平台选择暂未上线');
    if (action === 'knowledge-online-link') return openKnowledgeOnlineLinkForm();
    if (action === 'cancel-knowledge-online') return closeKnowledgeDialog();
    if (action === 'submit-knowledge-online') return submitKnowledgeOnlineLink();
    if (action === 'import-knowledge') return importKnowledgeRows([target.closest('[data-knowledge-row]')].filter(Boolean));
    if (action === 'import-selected-knowledge') {
      const rows = $$('[data-knowledge-row]:not([hidden])').filter((row) => $('[data-knowledge-select]', row)?.checked);
      return importKnowledgeRows(rows);
    }
    if (action === 'knowledge-placeholder') return showToast('新建资料库暂未上线');
    if (action === 'toggle-project-sort') return toggleProjectSortMenu();
    if (action === 'billing') return showToast('计费说明为演示入口');
    if (action === 'custom-model') return showToast('自定义模型面板为演示入口');
    if (action === 'home') return setView('create');
  }

  document.addEventListener('click', (event) => {
    const textSlot = event.target.closest?.('[data-composer-text-slot]');
    if (textSlot) {
      if (textSlot.dataset.composerTextSurface === 'home') {
        activateHomeComposerTextSlot(Number(textSlot.dataset.composerTextSlot));
      } else {
        activateConversationTextSlot(Number(textSlot.dataset.composerTextSlot));
      }
      return;
    }
    if (event.target.matches('[data-testid="knowledge-detail-dialog"]')) closeKnowledgeDetail();
    if (event.target.matches('[data-testid="knowledge-item-dialog"]')) closeKnowledgeItemDialog();
    const clickedInsideDropdown = Boolean(event.target.closest('[data-dropdown-boundary]'));
    const actionTarget = event.target.closest('[data-action]');
    if (actionTarget) handleAction(actionTarget.dataset.action, actionTarget);
    if (!event.target.closest('.knowledge-row-actions,[data-testid="knowledge-row-dropdown"]')) closeKnowledgeMenu();

    const globalSearchResult = event.target.closest('[data-global-search-result]');
    if (globalSearchResult) activateGlobalSearchResult(globalSearchResult.dataset.globalSearchResult);

    const nav = event.target.closest('[data-nav]');
    if (nav) activateNav(nav);

    const mode = event.target.closest('[data-mode]');
    if (mode) selectMode(mode.dataset.mode);

    const model = event.target.closest('[data-model-option]');
    if (model) toggleModel(model.dataset.modelOption);

    const notificationFilter = event.target.closest('[data-notification-filter]');
    if (notificationFilter) selectNotificationFilter(notificationFilter.dataset.notificationFilter);

    const notification = event.target.closest('[data-notification-id]');
    if (notification) markNotificationRead(notification.dataset.notificationId);

    const inspiration = event.target.closest('[data-prompt]');
    if (inspiration) {
      const toolName = inspiration.dataset.creationTool;
      if (toolName) {
        setSelectedTool(toolName);
        setPrompt(inspiration.dataset.prompt, false, true);
      } else {
        setPrompt(inspiration.dataset.prompt);
      }
    }

    const discoveryTab = event.target.closest('[data-discovery-tab]');
    if (discoveryTab) selectDiscoveryTab(discoveryTab.dataset.discoveryTab);

    const creationCategory = event.target.closest('[data-creation-category]');
    if (creationCategory) selectCreationToolCategory(creationCategory.dataset.creationCategory);

    const homeSkillCategory = event.target.closest('[data-home-skill-category]');
    if (homeSkillCategory) selectHomeSkillCategory(homeSkillCategory.dataset.homeSkillCategory);

    const skill = event.target.closest('[data-skill]');
    if (skill) {
      const surface = composerSurfaceFor(skill);
      setSelectedSkill(skill.dataset.skill);
      if (surface === 'conversation') {
        $('[data-testid="conversation-input"]').focus();
      } else {
        setPrompt('为我解释一下这个技能的最佳使用方式。', true);
      }
      closeOverlays();
    }

    const skillTab = event.target.closest('[data-skill-tab]');
    if (skillTab) selectSkillTab(skillTab.dataset.skillTab);

    const capabilityTab = event.target.closest('[data-capability-tab]');
    if (capabilityTab) selectCapabilityTab(capabilityTab.dataset.capabilityTab);

    const skillCategory = event.target.closest('[data-skill-category]');
    if (skillCategory) selectSkillCategory(skillCategory.dataset.skillCategory);

    const composerSkillCategory = event.target.closest('[data-composer-skill-category]');
    if (composerSkillCategory) selectComposerSkillCategory(composerSkillCategory.dataset.composerSkillCategory);

    const useSkill = event.target.closest('[data-use-skill]');
    if (useSkill) installAndUseSkill(useSkill.dataset.useSkill);

    const projectType = event.target.closest('[data-project-type]');
    if (projectType) openProjectDialog(projectType.dataset.projectType);

    const sidebarProjectGroup = event.target.closest('[data-sidebar-project-group]');
    if (sidebarProjectGroup) selectSidebarProjectGroup(sidebarProjectGroup.dataset.sidebarProjectGroup);

    const sidebarProjectSort = event.target.closest('[data-sidebar-project-sort]');
    if (sidebarProjectSort) selectSidebarProjectSort(sidebarProjectSort.dataset.sidebarProjectSort);

    const projectCardSort = event.target.closest('[data-project-card-sort]');
    if (projectCardSort) selectProjectCardSort(projectCardSort.dataset.projectCardSort);

    const selectedProject = event.target.closest('[data-select-project]');
    if (selectedProject) selectComposerProject(selectedProject.dataset.selectProject);

    const projectTab = event.target.closest('[data-project-tab]');
    if (projectTab) showProjectOverview(projectTab.dataset.projectTab);

    const libraryTab = event.target.closest('[data-library-tab]');
    if (libraryTab) {
      selectLibraryTab(libraryTab.dataset.libraryTab);
      if (libraryTab.dataset.libraryTab === 'projects') {
        const selectedProjectTab = $('[data-project-tab][aria-selected="true"]');
        showProjectOverview(selectedProjectTab?.dataset.projectTab || 'personal');
      }
    }

    const assetScope = event.target.closest('[data-asset-scope]');
    if (assetScope) selectAssetScope(assetScope.dataset.assetScope);

    const assetPickerScope = event.target.closest('[data-asset-picker-scope]');
    if (assetPickerScope) setAssetPickerScope(assetPickerScope.dataset.assetPickerScope);

    const assetPickerItem = event.target.closest('[data-asset-picker-item]');
    if (assetPickerItem) selectAssetPickerItem(assetPickerItem);

    const tool = event.target.closest('[data-tool]');
    if (tool) {
      if (tool.getAttribute('aria-disabled') === 'true') return;
      const toolName = tool.dataset.tool;
      closeCreationFlyout(true);
      setView('create');
      setSelectedTool(toolName);
      setPrompt(`使用「${toolName}」工具，帮我完成：`, false, true);
      showToast(`已选择「${toolName}」`);
    }

    const connector = event.target.closest('[data-connect]');
    if (connector) showToast(`「${connector.dataset.connect}」暂未上线`);

    const sidebarProject = event.target.closest('[data-sidebar-project]');
    if (sidebarProject && !event.target.closest('[data-sidebar-project-control]')) {
      toggleSidebarProject(sidebarProject.dataset.projectId);
    }

    const projectDirectory = event.target.closest('[data-project-directory]');
    if (projectDirectory) {
      openProjectDirectory(
        projectDirectory.dataset.projectId,
        projectDirectory.dataset.directoryName,
        projectDirectory
      );
    }

    const projectFile = event.target.closest('[data-project-file]');
    if (projectFile) selectProjectFile(projectFile);

    const sidebarConversation = event.target.closest('[data-sidebar-conversation]');
    if (sidebarConversation && !event.target.closest('[data-conversation-pin]')) {
      openConversation(sidebarConversation.dataset.projectId, sidebarConversation.dataset.conversationId);
    }

    const knowledgeSpace = event.target.closest('[data-knowledge-space]');
    if (knowledgeSpace) selectKnowledgeSpace(knowledgeSpace.dataset.knowledgeSpace);

    const knowledgeDirectory = event.target.closest('[data-knowledge-directory]');
    if (knowledgeDirectory) selectKnowledgeDirectory(knowledgeDirectory.dataset.knowledgeDirectory);

    const knowledgeSort = event.target.closest('[data-knowledge-sort]');
    if (knowledgeSort) sortKnowledgeDocuments(knowledgeSort.dataset.knowledgeSort);

    const knowledgeView = event.target.closest('[data-knowledge-view]');
    if (knowledgeView) setKnowledgeView(knowledgeView.dataset.knowledgeView);

    const knowledgeFilter = event.target.closest('[data-knowledge-filter]');
    if (knowledgeFilter) selectKnowledgeFilter(knowledgeFilter.dataset.knowledgeFilter);

    const knowledgeRow = event.target.closest('[data-knowledge-row]');
    if (knowledgeRow && !event.target.closest('input,button')) {
      openKnowledgeDetail(knowledgeRow);
    }

    if (!clickedInsideDropdown) closeTransientDropdowns();
    if (!event.target.closest('[data-conversation-share]')) closeConversationShare();
    if (!event.target.closest('[data-testid="command-menu"],[data-command-input]')) closeCommandMenu();
  });

  const globalSearchInput = $('[data-testid="search-input"]');
  globalSearchInput.addEventListener('input', renderGlobalSearchResults);
  globalSearchInput.addEventListener('keydown', (event) => {
    if (event.isComposing) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setGlobalSearchActiveIndex(state.globalSearchActiveIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setGlobalSearchActiveIndex(state.globalSearchActiveIndex - 1);
    } else if (event.key === 'Enter' && state.globalSearchActiveIndex >= 0) {
      event.preventDefault();
      const option = $$('[data-global-search-result]')[state.globalSearchActiveIndex];
      if (option) activateGlobalSearchResult(option.dataset.globalSearchResult);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeSearchPanel();
      $('[data-testid="search-trigger"]').focus();
    }
  });

  $('[data-testid="project-search"]').addEventListener('input', (event) => {
    filterProjects(event.target.value);
  });

  $('[data-testid="skill-search"]').addEventListener('input', filterSkills);

  $('[data-testid="composer-skill-search"]').addEventListener('input', filterComposerSkills);

  $('[data-testid="home-discovery-search"]').addEventListener('input', filterHomeDiscovery);

  $('[data-testid="knowledge-search"]').addEventListener('input', filterKnowledgeDocuments);

  $('[data-testid="knowledge-project-filter"]').addEventListener('change', (event) => {
    selectKnowledgeDirectory(event.target.value);
  });

  $('[data-testid="knowledge-space-tabs"]').addEventListener('keydown', (event) => {
    if (!event.target.matches('[data-knowledge-space]')) return;
    const tabs = $$('[data-knowledge-space]', event.currentTarget);
    const current = tabs.indexOf(event.target);
    let next = current;
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    const tab = tabs[next];
    selectKnowledgeSpace(tab.dataset.knowledgeSpace);
    tab.focus();
  });

  $('.knowledge-filter-tabs').addEventListener('keydown', (event) => {
    if (!event.target.matches('[data-knowledge-filter]') || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const next = state.knowledgeFilter === 'all' ? 'trash' : 'all';
    selectKnowledgeFilter(next);
    $(`[data-knowledge-filter="${next}"]`).focus();
  });

  $('[data-testid="knowledge-documents"]').addEventListener('scroll', () => closeKnowledgeMenu());
  window.addEventListener('resize', () => closeKnowledgeMenu());

  $('[data-testid="knowledge-online-url"]').addEventListener('input', (event) => {
    if (event.target.getAttribute('aria-invalid') !== 'true') return;
    event.target.setAttribute('aria-invalid', 'false');
    const error = $('[data-testid="knowledge-online-error"]');
    error.textContent = '';
    error.hidden = true;
  });

  $('[data-testid="scheduled-task-search"]').addEventListener('input', renderScheduledTasks);

  const creationNavEntry = $('.create-nav-entry');
  creationNavEntry.addEventListener('mouseenter', openCreationFlyout);
  creationNavEntry.addEventListener('mouseleave', scheduleCreationFlyoutClose);
  creationNavEntry.addEventListener('focusin', openCreationFlyout);
  creationNavEntry.addEventListener('focusout', (event) => {
    if (!creationNavEntry.contains(event.relatedTarget)) scheduleCreationFlyoutClose();
  });

  $('[data-testid="notification-search"]').addEventListener('input', renderAccountNotifications);

  $$('[data-testid="scheduled-time-hour"], [data-testid="scheduled-time-minute"]').forEach((input) => {
    input.addEventListener('compositionstart', () => { input.dataset.composing = 'true'; });
    input.addEventListener('compositionend', (event) => {
      input.dataset.composing = 'false';
      handleScheduledTimeInput(event);
    });
    input.addEventListener('input', handleScheduledTimeInput);
    input.addEventListener('blur', handleScheduledTimeBlur);
    input.addEventListener('keydown', handleScheduledTimeKeydown);
  });

  $$('[data-command-input]').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.dataset.testid === 'conversation-input') syncConversationModuleTextSlots();
      if (input.dataset.testid === 'prompt-input') syncHomeComposerTextSlots();
      updateCommandMenu(input);
      if (input.dataset.testid === 'conversation-input') renderConversationModuleTextFlow();
      if (input.dataset.testid === 'prompt-input') renderHomeComposerTextFlow();
    });
    input.addEventListener('click', () => updateCommandMenu(input));
    input.addEventListener('keyup', (event) => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) updateCommandMenu(input);
    });
    input.addEventListener('keydown', handleCommandMenuKeydown);
  });

  document.addEventListener('input', (event) => {
    const textSlot = event.target.closest?.('[data-composer-text-slot]');
    if (!textSlot) return;
    const index = Number(textSlot.dataset.composerTextSlot);
    if (textSlot.dataset.composerTextSurface === 'home') {
      state.homeComposerTextSlots[index] = textSlot.textContent;
    } else {
      state.conversationModuleTextSlots[index] = textSlot.textContent;
    }
  });

  const commandMenu = $('[data-testid="command-menu"]');
  commandMenu.addEventListener('mousedown', (event) => {
    if (event.target.closest('[data-command-option]')) event.preventDefault();
  });
  commandMenu.addEventListener('click', (event) => {
    const option = event.target.closest('[data-command-option]');
    if (option) selectCommandItem(Number(option.dataset.commandOption));
  });
  window.addEventListener('resize', positionCommandMenu);

  $('[data-testid="prompt-input"]').addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    const prompt = getHomeComposerText();
    if (!prompt) return showToast('请先输入创作内容');
    submitConversation(prompt);
  });

  $('[data-testid="conversation-input"]').addEventListener('keydown', (event) => {
    if (event.defaultPrevented) return;
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    sendConversationFollowup();
  });

  $('[data-testid="conversation-title"]').addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    startConversationTitleEdit();
  });

  const conversationTitleInput = $('[data-testid="conversation-title-input"]');
  conversationTitleInput.addEventListener('input', updateConversationTitleValidation);
  conversationTitleInput.addEventListener('keydown', (event) => {
    if (event.isComposing) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      finishConversationTitleEdit(true);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      finishConversationTitleEdit(false);
    }
  });
  conversationTitleInput.addEventListener('blur', () => finishConversationTitleEdit(true));

  $('[data-testid="knowledge-select-all"]').addEventListener('change', (event) => {
    $$('[data-knowledge-row]:not([hidden]) [data-knowledge-select]').forEach((check) => { check.checked = event.target.checked; });
    updateKnowledgeSelectionState();
  });

  document.addEventListener('change', (event) => {
    if (event.target.matches('[data-knowledge-select]')) updateKnowledgeSelectionState();
  });

  document.addEventListener('mouseover', (event) => {
    const row = event.target.closest('[data-sidebar-conversation]');
    if (row && !row.contains(event.relatedTarget)) showConversationHoverCard(row);
  });

  document.addEventListener('mouseout', (event) => {
    const row = event.target.closest('[data-sidebar-conversation]');
    const card = $('[data-testid="conversation-hover-card"]');
    if (row && !row.contains(event.relatedTarget) && !card?.contains(event.relatedTarget)) hideConversationHoverCard();
  });

  $('[data-testid="conversation-hover-card"]').addEventListener('mouseleave', hideConversationHoverCard);

  const projectNameInput = $('[data-testid="project-name-input"]');
  projectNameInput.addEventListener('input', () => {
    updateProjectDialogSubmit();
  });
  projectNameInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.isComposing) return;
    const dialog = $('[data-testid="project-dialog"]');
    const submit = $('[data-action="submit-project"]');
    if (dialog.hidden || submit.disabled) return;
    event.preventDefault();
    submitProjectDialog();
  });

  $('[data-testid="asset-project-select"]').addEventListener('change', (event) => {
    state.assetProjectId = event.target.value || null;
    $('[data-asset-current-project]').textContent = state.assetProjectId
      ? state.projects.get(state.assetProjectId).name
      : '请选择可用项目';
  });

  $('[data-testid="asset-picker-project-select"]').addEventListener('change', (event) => {
    state.assetPickerProjectId = event.target.value || null;
    filterAssetPickerItems();
  });

  $('[data-testid="local-folder-input"]').addEventListener('change', (event) => {
    const files = [...event.target.files];
    if (!files.length) return;
    setSelectedAsset(
      files.length === 1 ? files[0].name : `${files[0].name} 等 ${files.length} 个文件`,
      state.materialTarget || 'home'
    );
    state.materialTarget = null;
    event.target.value = '';
    showToast(`已选择 ${files.length} 个本地素材`);
  });

  $('[data-testid="skill-file-input"]').addEventListener('change', (event) => {
    setSkillImportFile(event.target.files[0]);
  });

  document.addEventListener('dragstart', (event) => {
    const module = event.target.closest?.('[data-composer-module]');
    if (!module) return;
    state.draggedComposerModuleId = module.dataset.composerModule;
    module.classList.add('is-dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', state.draggedComposerModuleId);
  });

  document.addEventListener('dragover', (event) => {
    const target = event.target.closest?.('[data-composer-module]');
    const textSlot = event.target.closest?.('[data-composer-text-slot]');
    const inputRow = event.target.closest?.('.composer-input-row, .conversation-composer-input-row');
    if (!state.draggedComposerModuleId) return;
    if (textSlot) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      $$('[data-composer-module]').forEach((module) => module.classList.remove('is-drop-before', 'is-drop-after'));
      $$('.composer-modules').forEach((container) => container.classList.remove('is-drop-at-start', 'is-drop-at-end'));
      $$('[data-composer-text-slot]').forEach((slot) => slot.classList.remove('is-drop-target'));
      state.composerModuleDropId = null;
      state.composerModuleDropAfter = false;
      state.composerModuleDropTextSlot = {
        surface: textSlot.dataset.composerTextSurface,
        index: Number(textSlot.dataset.composerTextSlot)
      };
      textSlot.classList.add('is-drop-target');
      return;
    }
    if (!target && inputRow) {
      const container = $('.composer-modules', inputRow);
      if (!container || container.hidden) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      $$('[data-composer-module]').forEach((module) => module.classList.remove('is-drop-before', 'is-drop-after'));
      $$('.composer-modules').forEach((item) => item.classList.remove('is-drop-at-start', 'is-drop-at-end'));
      const box = container.getBoundingClientRect();
      const placementBox = box.width > 0 ? box : inputRow.getBoundingClientRect();
      state.composerModuleDropId = null;
      state.composerModuleDropAfter = event.clientX >= placementBox.left + placementBox.width / 2;
      container.classList.add(state.composerModuleDropAfter ? 'is-drop-at-end' : 'is-drop-at-start');
      return;
    }
    if (!target || target.dataset.composerModule === state.draggedComposerModuleId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    $$('[data-composer-module]').forEach((module) => module.classList.remove('is-drop-before', 'is-drop-after'));
    $$('.composer-modules').forEach((container) => container.classList.remove('is-drop-at-start', 'is-drop-at-end'));
    const box = target.getBoundingClientRect();
    state.composerModuleDropId = target.dataset.composerModule;
    state.composerModuleDropAfter = event.clientX >= box.left + box.width / 2;
    target.classList.add(state.composerModuleDropAfter ? 'is-drop-after' : 'is-drop-before');
  });

  document.addEventListener('drop', (event) => {
    const target = event.target.closest?.('[data-composer-module]');
    const textSlot = event.target.closest?.('[data-composer-text-slot]');
    const inputRow = event.target.closest?.('.composer-input-row, .conversation-composer-input-row');
    const isEdgeDrop = !target && Boolean(inputRow);
    if (!state.draggedComposerModuleId || (!target && !isEdgeDrop)) return;
    if (target?.dataset.composerModule === state.draggedComposerModuleId) return;
    event.preventDefault();
    const sourceId = state.draggedComposerModuleId;
    const textSlotDrop = state.composerModuleDropTextSlot;
    const targetId = target ? state.composerModuleDropId : null;
    const placeAfter = state.composerModuleDropAfter;
    clearComposerModuleDragState();
    if (textSlot && textSlotDrop) {
      moveComposerModuleToTextSlot(sourceId, textSlotDrop.surface, textSlotDrop.index);
      return;
    }
    moveComposerModule(sourceId, targetId, placeAfter);
  });

  document.addEventListener('dragend', (event) => {
    if (event.target.closest?.('[data-composer-module]')) clearComposerModuleDragState();
  });

  const skillFileTransfer = $('[data-skill-file-section]');
  skillFileTransfer.addEventListener('dragenter', (event) => {
    event.preventDefault();
    if (state.skillDialogMode === 'import') skillFileTransfer.classList.add('is-dragging');
  });
  skillFileTransfer.addEventListener('dragover', (event) => {
    event.preventDefault();
    if (state.skillDialogMode === 'import') skillFileTransfer.classList.add('is-dragging');
  });
  skillFileTransfer.addEventListener('dragleave', (event) => {
    if (!skillFileTransfer.contains(event.relatedTarget)) skillFileTransfer.classList.remove('is-dragging');
  });
  skillFileTransfer.addEventListener('drop', (event) => {
    event.preventDefault();
    skillFileTransfer.classList.remove('is-dragging');
    setSkillImportFile(event.dataTransfer.files[0]);
  });

  const sidebarProjectList = $('[data-sidebar-project-list]');
  const sidebarDropSurface = $('[data-testid="sidebar"]');
  sidebarDropSurface.addEventListener('dragstart', (event) => {
    const conversation = event.target.closest('[data-sidebar-conversation], [data-sidebar-pinned-conversation]');
    if (conversation) {
      if (event.target.closest('[data-conversation-pin]')) {
        event.preventDefault();
        return;
      }
      const sourceProjectId = conversation.dataset.projectId;
      if (!sourceProjectId || !getConversation(sourceProjectId, conversation.dataset.conversationId)) {
        event.preventDefault();
        return;
      }
      clearSidebarProjectDragState();
      clearSidebarConversationDragState();
      state.sidebarDraggedConversationId = conversation.dataset.conversationId;
      state.sidebarDraggedConversationProjectId = sourceProjectId;
      conversation.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', conversation.dataset.conversationId);
      return;
    }
    const project = event.target.closest('[data-sidebar-project]');
    if (!project || isSidebarProjectPinned(project.dataset.projectId) || project.dataset.projectId === 'unbound-project' || event.target.closest('[data-sidebar-project-control]')) {
      event.preventDefault();
      return;
    }
    state.sidebarDraggedProjectId = project.dataset.projectId;
    project.classList.add('is-dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', project.dataset.projectId);
  });
  sidebarDropSurface.addEventListener('dragover', (event) => {
    if (state.sidebarDraggedConversationId) {
      const target = event.target.closest('[data-sidebar-project], [data-pinned-project-id]');
      const targetProjectId = target?.dataset.projectId || target?.dataset.pinnedProjectId;
      if (!target || !targetProjectId || targetProjectId === state.sidebarDraggedConversationProjectId) {
        state.sidebarDropConversationTargetProjectId = null;
        $$('[data-sidebar-project]', sidebarProjectList).forEach((project) => project.classList.remove('is-conversation-drop-target'));
        $$('[data-pinned-project-id]').forEach((project) => project.classList.remove('is-conversation-drop-target'));
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      $$('[data-sidebar-project]', sidebarProjectList).forEach((project) => project.classList.remove('is-conversation-drop-target'));
      $$('[data-pinned-project-id]').forEach((project) => project.classList.remove('is-conversation-drop-target'));
      state.sidebarDropConversationTargetProjectId = targetProjectId;
      target.classList.add('is-conversation-drop-target');
      return;
    }
    const target = event.target.closest('[data-sidebar-project]');
    if (!state.sidebarDraggedProjectId || !target || isSidebarProjectPinned(target.dataset.projectId) || target.dataset.projectId === 'unbound-project' || target.dataset.projectId === state.sidebarDraggedProjectId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    $$('[data-sidebar-project]', sidebarProjectList).forEach((project) => project.classList.remove('is-drop-before', 'is-drop-after'));
    const targetBox = target.getBoundingClientRect();
    state.sidebarDropProjectId = target.dataset.projectId;
    state.sidebarDropAfter = event.clientY >= targetBox.top + targetBox.height / 2;
    target.classList.add(state.sidebarDropAfter ? 'is-drop-after' : 'is-drop-before');
  });
  sidebarDropSurface.addEventListener('drop', (event) => {
    if (state.sidebarDraggedConversationId && state.sidebarDropConversationTargetProjectId) {
      const target = event.target.closest('[data-sidebar-project], [data-pinned-project-id]');
      const droppedProjectId = target?.dataset.projectId || target?.dataset.pinnedProjectId;
      if (!target || droppedProjectId !== state.sidebarDropConversationTargetProjectId) {
        clearSidebarConversationDragState();
        return;
      }
      event.preventDefault();
      const conversationId = state.sidebarDraggedConversationId;
      const sourceProjectId = state.sidebarDraggedConversationProjectId;
      const targetProjectId = state.sidebarDropConversationTargetProjectId;
      clearSidebarConversationDragState();
      moveConversationToProject(sourceProjectId, conversationId, targetProjectId);
      return;
    }
    if (!state.sidebarDraggedProjectId || !state.sidebarDropProjectId) return;
    event.preventDefault();
    const draggedProjectId = state.sidebarDraggedProjectId;
    const targetProjectId = state.sidebarDropProjectId;
    const placeAfter = state.sidebarDropAfter;
    clearSidebarProjectDragState();
    reorderSidebarProject(draggedProjectId, targetProjectId, placeAfter);
  });
  sidebarDropSurface.addEventListener('dragend', () => {
    clearSidebarProjectDragState();
    clearSidebarConversationDragState();
  });

  $('[data-testid="knowledge-local-file-input"]').addEventListener('change', (event) => {
    const files = [...event.target.files];
    if (!files.length) return;
    files.forEach((file) => createKnowledgeDocument(file.name, file));
    closeKnowledgeDialog();
    showToast(`已添加 ${files.length} 个本地文件`);
  });

  $('[data-testid="knowledge-version-file-input"]').addEventListener('change', (event) => {
    const row = state.knowledgeVersionRow;
    const file = event.target.files[0];
    state.knowledgeVersionRow = null;
    if (!row || !file) return;
    const currentExtension = row.dataset.name.split('.').pop()?.toLowerCase();
    const nextExtension = file.name.split('.').pop()?.toLowerCase();
    if (currentExtension !== nextExtension) return showToast('请选择与当前文档相同格式的文件');
    knowledgeOriginalFiles.set(row, file);
    const summary = $('.knowledge-file small', row);
    const match = summary.textContent.match(/^v(\d+)\.(\d+)(?:\s*·\s*(.*))?$/);
    const version = match ? `v${match[1]}.${Number(match[2]) + 1}` : 'v1.1';
    const detail = match?.[3] || '已上传新版本';
    summary.textContent = `${version} · ${detail}`;
    const updated = $('.knowledge-updated-cell', row);
    updated.firstChild.textContent = '刚刚';
    const status = $('small', updated);
    if (status) {
      status.className = 'status-processing';
      status.textContent = '解析中';
    }
    row.dataset.updated = String(++state.knowledgeDocumentSequence);
    sortKnowledgeDocuments(state.knowledgeSort);
    showToast(`已上传「${row.dataset.name}」的新版本`);
  });

  document.addEventListener('keydown', (event) => {
    const knowledgeDetail = $('[data-testid="knowledge-detail-dialog"]');
    if (event.key === 'Tab' && !knowledgeDetail.hidden) {
      const buttons = $$('button', knowledgeDetail);
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if ((event.shiftKey && event.target === first) || (!event.shiftKey && event.target === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (!knowledgeDetail.contains(event.target)) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    const knowledgeItemDialog = $('[data-testid="knowledge-item-dialog"]');
    if (event.key === 'Tab' && !knowledgeItemDialog.hidden) {
      const focusables = $$('button,input,select', knowledgeItemDialog).filter((node) => node.getClientRects().length);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if ((event.shiftKey && event.target === first) || (!event.shiftKey && event.target === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
      return;
    }
    const projectMenuTrigger = event.target.closest?.('[data-action="toggle-sidebar-project-menu"]');
    if (projectMenuTrigger && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      toggleSidebarProjectActionMenu(projectMenuTrigger.closest('[data-sidebar-project]')?.dataset.projectId);
      return;
    }
    const projectPin = event.target.closest?.('[data-action="toggle-project-pin"]');
    if (projectPin && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      toggleProjectPin(projectPin.closest('[data-sidebar-project]')?.dataset.projectId);
      return;
    }
    const projectConversation = event.target.closest?.('[data-action="new-project-conversation"]');
    if (projectConversation && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      createConversationInProject(projectConversation.closest('[data-sidebar-project]')?.dataset.projectId);
      return;
    }
    const pin = event.target.closest?.('[data-conversation-pin]');
    if (pin && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      toggleConversationPin(pin.closest('[data-sidebar-conversation]'));
      return;
    }
    const removableContext = event.target.closest?.('[data-removable-context]');
    if (removableContext && (event.key === 'Delete' || event.key === 'Backspace')) {
      event.preventDefault();
      removeSelectedComposerContext(
        removableContext.dataset.removableContext,
        removableContext.dataset.composerModule || removableContext.dataset.composerReference,
        removableContext.dataset.referenceSurface || composerSurfaceFor(removableContext)
      );
      const input = removableContext.closest('[data-testid="conversation-composer"]')
        ? $('[data-testid="conversation-input"]')
        : $('[data-testid="prompt-input"]');
      input.focus();
      return;
    }
    const composerInput = event.target.matches?.('[data-command-input]') ? event.target : null;
    if (
      composerInput
      && event.key === 'Backspace'
      && composerInput.value === ''
      && composerInput.selectionStart === 0
      && composerInput.selectionEnd === 0
      && removeSelectedComposerContext(null, null, composerSurfaceFor(composerInput))
    ) {
      event.preventDefault();
      return;
    }
    if (event.key === 'Escape') {
      if (state.knowledgeMenuRow) closeKnowledgeMenu(true);
      const scheduledPopoverWasOpen = Boolean(
        $('.scheduled-select-trigger[aria-expanded="true"]')
        || $('[data-testid="scheduled-time-trigger"][aria-expanded="true"]')
      );
      closeCommandMenu();
      closeTransientDropdowns();
      closeConversationShare();
      setUploadDialog(false);
      closeProjectDialog();
      closeProjectDeleteDialog();
      closeKnowledgeDialog();
      closeKnowledgeItemDialog();
      closeKnowledgeDetail();
      closeAssetPicker();
      closeKnowledgePicker();
      if (!scheduledPopoverWasOpen) closeScheduledTaskDrawer();
    }
  });

  $$('[data-knowledge-row]').forEach((row) => {
    ensureKnowledgeDetailTrigger(row);
    ensureKnowledgeRowActions(row);
  });
  selectMode('agent');
  selectCapabilityTab('skills');
  selectSkillTab('plaza');
  selectSkillCategory('all');
  selectKnowledgeSpace('public');
  sortKnowledgeDocuments('updated');
  setKnowledgeView('list');
  syncCreationFlyoutAvailability();
  renderHomeCreationTools();
  selectHomeSkillCategory('all');
  selectDiscoveryTab('tools');
  selectLibraryTab('projects');
  selectProjectTab('personal');
  selectAssetScope('personal');
  setSelectedSkill(null);
  setSelectedAsset(null);
  applySidebarProjectLayout();
  renderInstalledSkills();
  renderScheduledTasks();
  renderAccountRow();
  renderAccountNotifications();
  setView('create');
})();
