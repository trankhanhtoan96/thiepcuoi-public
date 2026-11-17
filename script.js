    /* ============================================================
   WEDDING INVITATION - ALL JAVASCRIPT
   ============================================================ */

    (function () {
        'use strict';

        /* ============================================================
   CONFIG — Cấu hình API
   ============================================================ */
        const CONFIG = {
            // Apps Script — dùng cho WRITE (no-cors, fire-and-forget)
            API_URL: 'YOUR_APPS_SCRIPT_WEB_APP_URL',
            // OpenSheet — dùng cho READ (CORS-friendly)
            SHEET_BASE: 'https://opensheet.elk.sh/YOUR_GOOGLE_SHEET_ID',
            API_TIMEOUT: 8000,
        };

        /* ============================================================
   I18N — Translations
   ============================================================ */
        const LANG_STORAGE_KEY = 'wedding_lang';
        let currentLang = 'vi';
        try {
            const urlLang = new URLSearchParams(window.location.search).get('lang');
            if (urlLang && ['vi', 'en', 'zh'].includes(urlLang)) {
                currentLang = urlLang;
                localStorage.setItem(LANG_STORAGE_KEY, urlLang);
            } else {
                const saved = localStorage.getItem(LANG_STORAGE_KEY);
                if (saved) currentLang = saved;
            }
        } catch (e) { /* ignore */ }

        const TRANSLATIONS = {
            vi: {
                // Cover
                cover_title: 'Thư mời cưới',
                cover_date: '22 tháng 8, 2026',
                cover_invite_label: '── Thân Mời ──',
                cover_guest_default: 'Quý khách',
                cover_open_btn: '💌 Mở Thiệp',
                // Hero
                hero_invite: 'Trân trọng kính mời',
                hero_subtitle: 'đến dự buổi tiệc chung vui nhân ngày thành hôn của chúng tôi',
                // Couple
                couple_title: 'Chú Rể & Cô Dâu',
                couple_groom: '🤵 Chú Rể',
                couple_bride: '👰 Cô Dâu',
                couple_groom_father: 'Con ông: <strong>Trần Văn Nô</strong>',
                couple_groom_mother: 'Và bà: <strong>Nguyễn Thị Thanh Chi</strong>',
                couple_groom_addr: 'Tân Sơn, xã Nguyễn Nghiêm, Quảng Ngãi',
                couple_bride_mother: 'Con bà: <strong>Lê Thị Hồng Thắm</strong>',
                couple_bride_addr: 'Khóm Long Bình, phường Long Đức, Vĩnh Long',
                // Events
                events_title: 'Sự Kiện Cưới',
                event_thanhhon: 'Lễ Thành Hôn',
                event_thanhhon_date: 'Thứ Bảy, 22 tháng 08, 2026',
                event_thanhhon_ruocdau: 'Rước dâu: 7:00 sáng',
                event_thanhhon_lamle: 'Làm lễ: 8:00 sáng',
                event_thanhhon_donkhach: 'Đón khách: từ 8:30 sáng',
                event_thanhhon_place: 'Tư gia nhà trai — Thôn Tân Sơn, Xã Nguyễn Nghiêm, Quảng Ngãi',
                event_map: '🗺️ Xem bản đồ',
                // Countdown
                countdown_title: 'Đếm ngược đến ngày chung đôi',
                countdown_days: 'Ngày',
                countdown_hours: 'Giờ',
                countdown_mins: 'Phút',
                countdown_secs: 'Giây',
                countdown_passed: 'Chúng tôi đã thành vợ chồng! 💕',
                // Story
                story_title: 'Câu chuyện tình yêu',
                story_1_title: 'Lần đầu gặp gỡ',
                story_1_desc: 'Chúng tôi quen biết và làm việc cùng nhau...',
                story_2_title: 'Bắt đầu hẹn hò',
                story_2_desc: 'Sau nhiều lần trò chuyện, chúng tôi chính thức yêu nhau với lời tỏ tình tại Giang Điền...',
                story_3_title: 'Lời cầu hôn',
                story_3_desc: 'Anh đã cầu hôn với lời hứa bên nhau trọn đời...',
                story_4_title: 'Lễ đính hôn',
                story_4_desc: 'Một lễ đính hôn đã được tổ chức cho đôi mình...',
                story_5_title: 'Lễ Vu Quy',
                story_5_desc: 'Lễ vu quy ấm cúng đã được tổ chức tại nhà gái ở Vĩnh Long...',
                story_6_title: 'Lễ Thành Hôn 💒',
                story_6_desc: 'Hành trình mới chính thức bắt đầu...',
                // Album
                album_title: 'Album Ảnh Cưới',
                // Wishes
                wishes_from_guests: 'Lời chúc từ khách mời',
                wishes_send: 'Gửi lời chúc',
                wishes_name_label: '🧑 Tên của bạn',
                wishes_name_placeholder: 'Nhập tên của bạn',
                wishes_msg_label: '💬 Lời chúc',
                wishes_msg_placeholder: 'Gửi lời chúc đến cô dâu chú rể...',
                wishes_submit: '💝 Gửi lời chúc',
                wishes_thanks: 'Cảm ơn lời chúc của bạn! 💝',
                wishes_change: 'Thay đổi lời chúc',
                wishes_load_more: 'Xem thêm lời chúc',
                // Banking
                banking_title: 'Mừng Cưới Online',
                banking_intro: 'Sự hiện diện của bạn là niềm vui và là món quà quý giá nhất. Nếu muốn gửi thêm lời chúc phúc...',
                banking_toggle: '🎁 Mừng cưới',
                banking_toggle_hide: '🎁 Ẩn thông tin',
                banking_account_label: 'STK',
                banking_bank_label: 'Ngân hàng',
                banking_copy: '📋 Copy STK',
                banking_copied: '✅ Đã copy!',
                banking_copied_toast: 'Đã copy số tài khoản!',
                // RSVP
                rsvp_title: 'Xác nhận tham dự',
                rsvp_name_label: '🧑 Họ và tên',
                rsvp_name_placeholder: 'Nhập họ và tên',
                rsvp_phone_label: '📱 Số điện thoại',
                rsvp_phone_placeholder: 'Nhập số điện thoại',
                rsvp_count_label: '👥 Số người tham dự',
                rsvp_attend_label: '🍽️ Quý khách sẽ tham dự?',
                rsvp_yes: 'Có, tôi sẽ đến',
                rsvp_no: 'Rất tiếc, tôi không thể',
                rsvp_submit: '✅ Xác nhận',
                rsvp_thanks_title: 'Cảm ơn quý khách!',
                rsvp_thanks_msg: 'Chúng tôi rất vui khi nhận được xác nhận của quý khách. Hẹn gặp bạn tại buổi tiệc!',
                rsvp_change: 'Thay đổi xác nhận',
                rsvp_popup_title: 'Quý khách sẽ tham dự?',
                rsvp_popup_msg: 'Hãy cho chúng tôi biết bạn có thể đến chung vui cùng chúng tôi không nhé!',
                rsvp_popup_later: 'Để sau',
                // Toasts
                toast_wish_empty: 'Vui lòng nhập tên và lời chúc!',
                toast_rsvp_empty: 'Vui lòng nhập họ và tên!',
                toast_rsvp_thanks: 'Cảm ơn bạn đã xác nhận! 🎉',
                // 404
                notfound_title: '404',
                notfound_msg: 'Không tìm thấy thiệp mời',
            },
            zh: {
                // Cover
                cover_title: '婚礼邀请函',
                cover_date: '2026年8月22日',
                cover_invite_label: '── 诚挚邀请 ──',
                cover_guest_default: '尊贵的宾客',
                cover_open_btn: '💌 打开请柬',
                // Hero
                hero_invite: '诚挚邀请',
                hero_subtitle: '参加我们的婚礼宴会，共同见证我们的幸福时刻',
                // Couple
                couple_title: '新郎 & 新娘',
                couple_groom: '🤵 新郎',
                couple_bride: '👰 新娘',
                couple_groom_father: '父亲：<strong>Trần Văn Nô</strong>',
                couple_groom_mother: '母亲：<strong>Nguyễn Thị Thanh Chi</strong>',
                couple_groom_addr: '广义省，阮严社，新山',
                couple_bride_mother: '母亲：<strong>Lê Thị Hồng Thắm</strong>',
                couple_bride_addr: '永隆市，隆德坊，隆平区',
                // Events
                events_title: '婚礼活动',
                event_thanhhon: '结婚典礼',
                event_thanhhon_date: '2026年8月22日，星期六',
                event_thanhhon_ruocdau: '迎亲：上午 7:00',
                event_thanhhon_lamle: '婚礼仪式：上午 8:00',
                event_thanhhon_donkhach: '恭候宾客：上午 8:30 起',
                event_thanhhon_place: '新郎家 — 广义省阮严社新山村',
                event_map: '🗺️ 查看地图',
                // Countdown
                countdown_title: '婚礼倒计时',
                countdown_days: '天',
                countdown_hours: '时',
                countdown_mins: '分',
                countdown_secs: '秒',
                countdown_passed: '我们已经结婚啦！💕',
                // Story
                story_title: '爱情故事',
                story_1_title: '初次相遇',
                story_1_desc: '我们相识并一起工作...',
                story_2_title: '开始约会',
                story_2_desc: '经过多次交谈，我们在江田正式确认了恋爱关系...',
                story_3_title: '求婚',
                story_3_desc: '他许下了一生相伴的承诺...',
                story_4_title: '订婚仪式',
                story_4_desc: '为我们举办了一场订婚仪式...',
                story_5_title: '出阁之礼',
                story_5_desc: '温馨的出阁仪式在永隆新娘家举行...',
                story_6_title: '大婚之日 💒',
                story_6_desc: '新的旅程正式开始...',
                // Album
                album_title: '婚纱相册',
                // Wishes
                wishes_from_guests: '宾客祝福',
                wishes_send: '送上祝福',
                wishes_name_label: '🧑 您的姓名',
                wishes_name_placeholder: '请输入您的姓名',
                wishes_msg_label: '💬 祝福语',
                wishes_msg_placeholder: '送上您对新郎新娘的祝福...',
                wishes_submit: '💝 送出祝福',
                wishes_thanks: '感谢您的祝福！💝',
                wishes_change: '修改祝福',
                wishes_load_more: '查看更多祝福',
                // Banking
                banking_title: '在线贺礼',
                banking_intro: '您的到来就是最珍贵的礼物。如果您想送上更多祝福...',
                banking_toggle: '🎁 送贺礼',
                banking_toggle_hide: '🎁 隐藏信息',
                banking_account_label: '账号',
                banking_bank_label: '银行',
                banking_copy: '📋 复制账号',
                banking_copied: '✅ 已复制！',
                banking_copied_toast: '账号已复制！',
                // RSVP
                rsvp_title: '确认出席',
                rsvp_name_label: '🧑 姓名',
                rsvp_name_placeholder: '请输入姓名',
                rsvp_phone_label: '📱 电话号码',
                rsvp_phone_placeholder: '请输入电话号码',
                rsvp_count_label: '👥 出席人数',
                rsvp_attend_label: '🍽️ 您是否出席？',
                rsvp_yes: '是的，我会出席',
                rsvp_no: '很遗憾，无法出席',
                rsvp_submit: '✅ 确认',
                rsvp_thanks_title: '感谢您！',
                rsvp_thanks_msg: '我们很高兴收到您的确认。期待在婚宴上与您相见！',
                rsvp_change: '修改确认',
                rsvp_popup_title: '您能出席吗？',
                rsvp_popup_msg: '请告诉我们您是否能来参加我们的婚宴，与我们共享喜悦！',
                rsvp_popup_later: '稍后再说',
                // Toasts
                toast_wish_empty: '请输入姓名和祝福语！',
                toast_rsvp_empty: '请输入姓名！',
                toast_rsvp_thanks: '感谢您的确认！🎉',
                // 404
                notfound_title: '404',
                notfound_msg: '未找到邀请函',
            },
            en: {
                // Cover
                cover_title: 'Wedding Invitation',
                cover_date: 'August 22, 2026',
                cover_invite_label: '── Cordially Invite ──',
                cover_guest_default: 'Dear Guest',
                cover_open_btn: '💌 Open Invitation',
                // Hero
                hero_invite: 'We cordially invite',
                hero_subtitle: 'to share in the joy of our wedding celebration',
                // Couple
                couple_title: 'Groom & Bride',
                couple_groom: '🤵 Groom',
                couple_bride: '👰 Bride',
                couple_groom_father: 'Father: <strong>Trần Văn Nô</strong>',
                couple_groom_mother: 'Mother: <strong>Nguyễn Thị Thanh Chi</strong>',
                couple_groom_addr: 'Tan Son, Nguyen Nghiem Commune, Quang Ngai',
                couple_bride_mother: 'Mother: <strong>Lê Thị Hồng Thắm</strong>',
                couple_bride_addr: 'Long Binh Hamlet, Long Duc Ward, Vinh Long',
                // Events
                events_title: 'Wedding Events',
                event_thanhhon: 'Wedding Ceremony',
                event_thanhhon_date: 'Saturday, August 22, 2026',
                event_thanhhon_ruocdau: 'Bridal procession: 7:00 AM',
                event_thanhhon_lamle: 'Ceremony: 8:00 AM',
                event_thanhhon_donkhach: 'Guest reception: from 8:30 AM',
                event_thanhhon_place: 'Groom\'s home — Tan Son Hamlet, Nguyen Nghiem Commune, Quang Ngai',
                event_map: '🗺️ View map',
                // Countdown
                countdown_title: 'Counting down to our big day',
                countdown_days: 'Days',
                countdown_hours: 'Hours',
                countdown_mins: 'Minutes',
                countdown_secs: 'Seconds',
                countdown_passed: 'We are now married! 💕',
                // Story
                story_title: 'Our Love Story',
                story_1_title: 'First Encounter',
                story_1_desc: 'We met and worked together...',
                story_2_title: 'Starting to Date',
                story_2_desc: 'After many conversations, we officially became a couple with a confession at Giang Dien...',
                story_3_title: 'The Proposal',
                story_3_desc: 'He proposed with a promise to be together for a lifetime...',
                story_4_title: 'Engagement Ceremony',
                story_4_desc: 'An engagement ceremony was held for the two of us...',
                story_5_title: 'Vu Quy Ceremony',
                story_5_desc: 'A heartwarming vu quy ceremony was held at the bride\'s home in Vinh Long...',
                story_6_title: 'Our Wedding Day 💒',
                story_6_desc: 'A new journey officially begins...',
                // Album
                album_title: 'Wedding Album',
                // Wishes
                wishes_from_guests: 'Wishes from guests',
                wishes_send: 'Send your wishes',
                wishes_name_label: '🧑 Your name',
                wishes_name_placeholder: 'Enter your name',
                wishes_msg_label: '💬 Your wish',
                wishes_msg_placeholder: 'Send your wishes to the bride and groom...',
                wishes_submit: '💝 Send wish',
                wishes_thanks: 'Thank you for your wishes! 💝',
                wishes_change: 'Edit wish',
                wishes_load_more: 'Load more wishes',
                // Banking
                banking_title: 'Online Wedding Gift',
                banking_intro: 'Your presence is the greatest gift. If you would like to send your blessings...',
                banking_toggle: '🎁 Send gift',
                banking_toggle_hide: '🎁 Hide info',
                banking_account_label: 'Account',
                banking_bank_label: 'Bank',
                banking_copy: '📋 Copy account',
                banking_copied: '✅ Copied!',
                banking_copied_toast: 'Account number copied!',
                // RSVP
                rsvp_title: 'RSVP',
                rsvp_name_label: '🧑 Full name',
                rsvp_name_placeholder: 'Enter your full name',
                rsvp_phone_label: '📱 Phone number',
                rsvp_phone_placeholder: 'Enter your phone number',
                rsvp_count_label: '👥 Number of guests',
                rsvp_attend_label: '🍽️ Will you attend?',
                rsvp_yes: 'Yes, I will attend',
                rsvp_no: 'Sorry, I cannot make it',
                rsvp_submit: '✅ Confirm',
                rsvp_thanks_title: 'Thank you!',
                rsvp_thanks_msg: 'We are delighted to receive your confirmation. See you at the celebration!',
                rsvp_change: 'Edit RSVP',
                rsvp_popup_title: 'Will you join us?',
                rsvp_popup_msg: 'Let us know whether you can come and celebrate with us!',
                rsvp_popup_later: 'Maybe later',
                // Toasts
                toast_wish_empty: 'Please enter your name and wish!',
                toast_rsvp_empty: 'Please enter your full name!',
                toast_rsvp_thanks: 'Thank you for your confirmation! 🎉',
                // 404
                notfound_title: '404',
                notfound_msg: 'Invitation not found',
            }
        };


        function t(key) {
            return TRANSLATIONS[currentLang][key] || TRANSLATIONS['vi'][key] || key;
        }

        function applyLanguage() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const text = t(key);
                if (text) el.innerHTML = text;
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                const text = t(key);
                if (text) el.placeholder = text;
            });
        }

        const LANG_FLAGS = { vi: '🇻🇳', en: '🇺🇸', zh: '🇨🇳' };

        function setLanguage(lang) {
            if (!TRANSLATIONS[lang]) return;
            currentLang = lang;
            try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (e) { /* ignore */ }
            applyLanguage();
            const btn = document.getElementById('langSelectBtn');
            if (btn) btn.textContent = LANG_FLAGS[lang] || '';
            document.querySelectorAll('.lang-select__option').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.lang === lang);
            });
        }

        /* ============================================================
   API CLIENT — OpenSheet (read) + Apps Script (write, no-cors)
   ============================================================ */
        let _sheetCache = null;

        const API = {
            async _fetchJSON(url) {
                const ctrl = new AbortController();
                const timer = setTimeout(() => ctrl.abort(), CONFIG.API_TIMEOUT);
                try {
                    const res = await fetch(url, {signal: ctrl.signal});
                    clearTimeout(timer);
                    if (!res.ok) return null;
                    return await res.json();
                } catch (e) {
                    clearTimeout(timer);
                    throw e;
                }
            },

            async _getSheet() {
                if (_sheetCache) return _sheetCache;
                _sheetCache = await this._fetchJSON(`${CONFIG.SHEET_BASE}/Sheet1`);
                return _sheetCache;
            },

            _post(data) {
                // Fire-and-forget POST to Apps Script (no-cors avoids CORS block)
                try {
                    fetch(CONFIG.API_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {'Content-Type': 'text/plain'},
                        body: JSON.stringify(data)
                    });
                } catch (e) {
                    console.warn('POST failed:', e);
                }
            },

            async getGuest(id) {
                try {
                    const rows = await this._getSheet();
                    if (Array.isArray(rows)) {
                        const row = rows.find(r => String(r.ID) === id);
                        if (row) return { id: row.ID, name: row['Tên gọi'], phone: row['Số điện thoại'], note: row['Ghi chú'], attend_wedding: row['Tham dự tiệc cưới'] === 'TRUE', wish: row['Lời chúc'] };
                    }
                } catch (e) {
                    console.warn('Guest lookup failed:', e);
                }
                return null;
            },

            async getWishes() {
                const wishes = [];
                try {
                    const rows = await this._getSheet();
                    if (Array.isArray(rows)) {
                        rows.filter(r => r['Lời chúc']).forEach(r => {
                            wishes.push({ name: r['Tên gọi'], message: r['Lời chúc'], timestamp: r['Thời gian'] || '' });
                        });
                    }
                } catch (e) { /* ignore */ }
                // Also fetch passerby wishes from Sheet2
                try {
                    const passerbyRows = await this._fetchJSON(`${CONFIG.SHEET_BASE}/Sheet2`);
                    if (Array.isArray(passerbyRows)) {
                        passerbyRows.forEach(r => {
                            const vals = Object.values(r);
                            const name = r['Name'] || r['Tên'] || r['Tên gọi'] || vals[0];
                            const msg = r['Wish'] || r['Lời chúc'] || vals[1];
                            const ts = r['Timestamp'] || r['Thời gian'] || vals[2] || '';
                            if (msg) wishes.push({ name: name || 'Ẩn danh', message: msg, timestamp: ts });
                        });
                    }
                } catch (e) { /* ignore */ }
                wishes.sort((a, b) => {
                    if (!a.timestamp) return 1;
                    if (!b.timestamp) return -1;
                    return new Date(b.timestamp) - new Date(a.timestamp);
                });
                return wishes;
            },

            async submitWish({id, name, message}) {
                this._post({action: 'submitWish', id, name, message});
                return {success: true};
            },

            async submitRSVP({id, attend_family, attend_wedding, num_guests, message}) {
                this._post({action: 'submitRSVP', id, attend_family, attend_wedding, num_guests, message});
                return {success: true};
            }
        };

        /* ============================================================
   URL ROUTING — Đọc ID từ URL
   ============================================================ */
        function getIdFromURL() {
            const path = window.location.pathname.replace(/^\/|\/$/g, '');
            return path || null;
        }

        /* ============================================================
   PERSONALIZATION — Hiển thị thông tin khách mời
   ============================================================ */
        let currentGuest = null;

        function capitalizeTitle(title) {
            return String(title || '').replace(/\b\w/g, c => c.toUpperCase());
        }

        function showLoading() {
            const nameEl = document.getElementById('guest-title-name');
            const photoEl = document.getElementById('guest-photo');
            if (nameEl) {
                nameEl.innerHTML = '<div class="loading-skeleton"></div>';
                nameEl.style.animation = 'none';
                nameEl.style.opacity = '1';
            }
            if (photoEl) photoEl.classList.add('hidden');
        }

        function hideLoading() {
            const nameEl = document.getElementById('guest-title-name');
            if (nameEl) {
                nameEl.innerHTML = '';
                nameEl.style.animation = '';
                nameEl.style.opacity = '';
            }
        }

        function show404() {
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#8B0000;text-align:center;padding:20px"><div><h1 style="font-size:72px;margin:0">' + t('notfound_title') + '</h1><p style="font-size:18px;margin-top:10px">' + t('notfound_msg') + '</p></div></div>';
        }

        function applyPersonalization(guest) {
            const guestNameEl = document.getElementById('guest-title-name');
            const guestPhotoEl = document.getElementById('guest-photo');
            const inviteNameEl = document.getElementById('invite-guest-name');

            if (guest) {
                if (guestNameEl) {
                    guestNameEl.textContent = guest.name;
                    guestNameEl.removeAttribute('data-i18n');
                }
                if (guestPhotoEl) guestPhotoEl.classList.add('hidden');
                if (inviteNameEl) {
                    inviteNameEl.textContent = guest.name;
                    inviteNameEl.removeAttribute('data-i18n');
                }
            } else {
                if (guestNameEl) {
                    guestNameEl.setAttribute('data-i18n', 'cover_guest_default');
                    guestNameEl.textContent = t('cover_guest_default');
                }
                if (guestPhotoEl) guestPhotoEl.classList.add('hidden');
                if (inviteNameEl) {
                    inviteNameEl.setAttribute('data-i18n', 'cover_guest_default');
                    inviteNameEl.textContent = t('cover_guest_default');
                }
            }
        }

        function prefillForms(guest) {
            if (!guest) return;

            const f = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.value = val;
            };
            f('rsvpName', guest.name);
            f('rsvpPhone', guest.phone);
            f('wishName', guest.name);

            // Pre-fill RSVP counter
            if (guest.num_guests) {
                const countEl = document.getElementById('rsvpCount');
                if (countEl) countEl.textContent = guest.num_guests;
            }

            // Nếu đã RSVP trước đó (check từ sheet)
            if (guest.attend_wedding) {
                const rsvpForm = document.getElementById('rsvpForm');
                const rsvpSuccess = document.getElementById('rsvpSuccess');
                if (rsvpForm) rsvpForm.style.display = 'none';
                if (rsvpSuccess) rsvpSuccess.classList.add('visible');
            }
        }

        async function initPersonalization() {
            const id = getIdFromURL();

            if (id) {
                showLoading();
                currentGuest = await API.getGuest(id);
                hideLoading();

                if (!currentGuest) {
                    show404();
                    return false;
                }

                applyPersonalization(currentGuest);
                prefillForms(currentGuest);
            } else {
                // No ID — hide RSVP form (personal), but keep wishes visible for everyone
                const rsvpSection = $('.rsvp');
                if (rsvpSection) rsvpSection.style.display = 'none';
            }
            return true;
        }

        /* ----- Data ----- */
        const WEDDING_DATE = new Date('2026-08-22T08:00:00+07:00');
        const SAMPLE_WISHES = [
            {name: 'Nguyễn Văn Tùng', message: 'Chúc hai bạn trăm năm hạnh phúc, sớm có em bé nhé! 🎉', time: '2 giờ trước'},
            {name: 'Lê Thị Thanh', message: 'Happy Wedding! Chúc anh chị mãi hạnh phúc bên nhau ❤️', time: '5 giờ trước'},
            {name: 'Phạm Minh Đức', message: 'Chúc mừng hạnh phúc! Wishing you a lifetime of love 💕', time: '1 ngày trước'}
        ];

        /* ----- DOM refs ----- */
        const $ = (s, p) => (p || document).querySelector(s);
        const $$ = (s, p) => [...(p || document).querySelectorAll(s)];
        const phoneFrame = $('#phoneFrame');
        const cover = $('#cover');
        const openBtn = $('#openBtn');
        const mainContent = $('#mainContent');
        const scrollProgress = $('#scrollProgress');
        const musicBtn = $('#musicBtn');
        const scrollTopBtn = $('#scrollTop');
        const toast = $('#toast');

        /* ============================================================
   0. MUSIC PLAYER (must be before openEnvelope)
   ============================================================ */
        const bgMusic = new Audio('music/cuoithoi.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.5;
        let isPlaying = false;

        function tryPlayMusic() {
            if (isPlaying) return;
            bgMusic.play().then(() => {
                isPlaying = true;
                musicBtn.classList.add('playing');
            }).catch(() => {
                // Browser blocked autoplay, user can click music button
            });
        }

        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                isPlaying = false;
                musicBtn.classList.remove('playing');
            } else {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    musicBtn.classList.add('playing');
                }).catch(() => {});
            }
        });

        /* ============================================================
   0b. LANGUAGE SELECT
   ============================================================ */
        const langSelect = $('#langSelect');
        const langSelectBtn = $('#langSelectBtn');
        if (langSelect && langSelectBtn) {
            setLanguage(currentLang);

            langSelectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = langSelect.classList.toggle('open');
                langSelectBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            $$('.lang-select__option').forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setLanguage(opt.dataset.lang);
                    langSelect.classList.remove('open');
                    langSelectBtn.setAttribute('aria-expanded', 'false');
                });
            });

            document.addEventListener('click', (e) => {
                if (!langSelect.contains(e.target)) {
                    langSelect.classList.remove('open');
                    langSelectBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        /* ============================================================
   1. PARTICLES (Cover background)
   ============================================================ */
        function initParticles() {
            const canvas = $('#particlesCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let particles = [];
            let animId;

            function resize() {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }

            resize();
            window.addEventListener('resize', resize);

            class Particle {
                constructor() {
                    this.reset();
                }

                reset() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2.5 + 0.5;
                    this.speedY = -(Math.random() * 0.3 + 0.1);
                    this.speedX = (Math.random() - 0.5) * 0.3;
                    this.opacity = Math.random() * 0.6 + 0.2;
                    this.life = 0;
                    this.maxLife = Math.random() * 200 + 100;
                }

                update() {
                    this.y += this.speedY;
                    this.x += this.speedX;
                    this.life++;
                    if (this.life > this.maxLife || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
                }

                draw() {
                    const fade = 1 - this.life / this.maxLife;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,215,0,${this.opacity * fade})`;
                    ctx.fill();
                }
            }

            for (let i = 0; i < 40; i++) particles.push(new Particle());

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                animId = requestAnimationFrame(animate);
            }

            animate();

            // Stop when cover is opened
            window.stopParticles = () => {
                cancelAnimationFrame(animId);
            };
        }

        /* ============================================================
   2. FALLING PETALS
   ============================================================ */
        function initPetals() {
            const container = $('#petalsContainer');
            const petalSVGs = [
                `<svg viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="6" ry="9" fill="rgba(255,182,193,0.6)" transform="rotate(-20 10 10)"/></svg>`,
                `<svg viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="5" ry="8" fill="rgba(255,105,180,0.5)" transform="rotate(15 10 10)"/></svg>`,
                `<svg viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="7" ry="5" fill="rgba(255,192,203,0.5)" transform="rotate(-10 10 10)"/></svg>`
            ];

            for (let i = 0; i < 7; i++) {
                const petal = document.createElement('div');
                petal.className = 'petal';
                const size = Math.random() * 12 + 10;
                const duration = Math.random() * 6 + 8;
                const delay = Math.random() * 10;
                const drift = (Math.random() - 0.5) * 80;
                const rot = Math.random() * 360;
                petal.style.cssText = `--size:${size}px;--duration:${duration}s;--delay:${delay}s;--drift:${drift}px;--rot:${rot}deg;left:${Math.random() * 100}%`;
                petal.innerHTML = petalSVGs[Math.floor(Math.random() * petalSVGs.length)];
                container.appendChild(petal);
            }
        }

        /* ============================================================
   3. OPEN ENVELOPE
   ============================================================ */
        let isOpened = false;

        function openEnvelope() {
            if (isOpened) return;
            isOpened = true;

            // Ripple effect on button
            const rect = openBtn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `width:200px;height:200px;left:${rect.width / 2 - 100}px;top:${rect.height / 2 - 100}px`;
            openBtn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            // Start music immediately in click handler to preserve user gesture
            tryPlayMusic();

            // Slide cover up
            setTimeout(() => {
                cover.classList.add('opened');
                mainContent.style.display = 'block';

                setTimeout(() => {
                    mainContent.classList.add('visible');
                    scrollProgress.classList.add('visible');
                    fireConfetti();
                    startCountdown();
                }, 300);

                // Stop cover particles
                if (window.stopParticles) window.stopParticles();
            }, 200);
        }

        openBtn.addEventListener('click', openEnvelope);

        /* ============================================================
   4. SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */
        function initScrollAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {threshold: 0.15, root: null});

            // Slight delay to ensure elements are in DOM
            setTimeout(() => {
                $$('.anim').forEach((el, i) => {
                    // Add stagger delay for children within same section
                    const siblings = $$('.anim', el.parentElement);
                    const idx = siblings.indexOf(el);
                    if (idx > 0) el.style.transitionDelay = `${idx * 0.12}s`;
                    observer.observe(el);
                });
            }, 500);
        }

        /* ============================================================
   5. SCROLL PROGRESS BAR
   ============================================================ */
        function initScrollProgress() {
            const container = phoneFrame;
            let ticking = false;

            function update() {
                const scrollEl = window.innerWidth > 768 ? phoneFrame : document.documentElement;
                const scrollTop = window.innerWidth > 768 ? phoneFrame.scrollTop : window.scrollY;
                const scrollHeight = (window.innerWidth > 768 ? phoneFrame.scrollHeight : document.documentElement.scrollHeight) - window.innerHeight;
                const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
                scrollProgress.style.width = progress + '%';

                // Show/hide scroll-to-top button
                if (progress > 30) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
                ticking = false;
            }

            const scrollTarget = window.innerWidth > 768 ? phoneFrame : window;
            scrollTarget.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(update);
                    ticking = true;
                }
            }, {passive: true});

            // Also listen on window for mobile
            if (scrollTarget !== window) {
                window.addEventListener('scroll', () => {
                    if (!ticking) {
                        requestAnimationFrame(update);
                        ticking = true;
                    }
                }, {passive: true});
            }
        }

        /* ============================================================
   6. SCROLL TO TOP
   ============================================================ */
        scrollTopBtn.addEventListener('click', () => {
            if (window.innerWidth > 768) {
                phoneFrame.scrollTo({top: 0, behavior: 'smooth'});
            } else {
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        });

        /* ============================================================
   7. COUNTDOWN TIMER
   ============================================================ */
        let countdownInterval;

        function startCountdown() {
            const boxes = $('#countdownBoxes');
            const passed = $('#countdownPassed');
            const days = $('#cdDays');
            const hours = $('#cdHours');
            const mins = $('#cdMins');
            const secs = $('#cdSecs');

            function update() {
                const now = new Date();
                const diff = WEDDING_DATE - now;

                if (diff <= 0) {
                    boxes.style.display = 'none';
                    passed.style.display = 'block';
                    clearInterval(countdownInterval);
                    return;
                }

                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);

                days.textContent = String(d).padStart(2, '0');
                hours.textContent = String(h).padStart(2, '0');
                mins.textContent = String(m).padStart(2, '0');
                secs.textContent = String(s).padStart(2, '0');
            }

            update();
            countdownInterval = setInterval(update, 1000);
        }

        /* ============================================================
   8. WISHES / GUESTBOOK
   ============================================================ */
        function addWishToUI(w) {
            const list = $('#wishesList');
            if (!list) return;
            const card = document.createElement('div');
            card.className = 'wish-card';
            const timeStr = w.time || (w.timestamp ? new Date(w.timestamp).toLocaleDateString('vi-VN') : 'Vừa xong');
            card.innerHTML = `
        <div class="wish-card__msg">"${escapeHtml(w.message)}"</div>
        <div class="wish-card__meta">
          <span class="wish-card__name">— ${escapeHtml(w.name || 'Ẩn danh')}</span>
          <span>🕐 ${escapeHtml(timeStr)}</span>
        </div>
      `;
            list.appendChild(card);
        }

        let allWishes = [];

        async function loadWishes() {
            allWishes = await API.getWishes();
            const list = $('#wishesList');
            if (!list) return;
            $$('.wish-card', list).forEach(c => c.remove());
            const oldMore = $('#wishLoadMore');
            if (oldMore) oldMore.remove();

            const toShow = allWishes.length === 0 ? SAMPLE_WISHES : allWishes;
            let shown = 0;

            function showNext() {
                toShow.slice(shown, shown + 5).forEach(w => addWishToUI(w));
                shown += 5;
                if (shown >= toShow.length) {
                    const btn = $('#wishLoadMore');
                    if (btn) btn.remove();
                }
            }

            showNext();

            if (toShow.length > 5) {
                const btn = document.createElement('a');
                btn.id = 'wishLoadMore';
                btn.className = 'wish-load-more';
                btn.textContent = t('wishes_load_more');
                btn.href = '#';
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showNext();
                });
                list.after(btn);
            }
        }

        function initWishes() {
            const nameInput = $('#wishName');
            const msgInput = $('#wishMsg');
            const submitBtn = $('#wishSubmit');
            const form = $('.wishes__form');
            const success = $('#wishSuccess');
            const changeBtn = $('#wishChange');

            submitBtn.addEventListener('click', async () => {
                const name = nameInput.value.trim();
                const msg = msgInput.value.trim();
                if (!name || !msg) {
                    showToast(t('toast_wish_empty'));
                    return;
                }

                const id = currentGuest ? currentGuest.id : '';
                await API.submitWish({id, name, message: msg});
                addWishToUI({name, message: msg, timestamp: new Date().toISOString()});

                form.style.display = 'none';
                success.classList.add('visible');
                fireConfetti();
            });

            changeBtn.addEventListener('click', () => {
                success.classList.remove('visible');
                form.style.display = '';
            });

            // Hide form if already submitted
            if (currentGuest && currentGuest.wish) {
                form.style.display = 'none';
                success.classList.add('visible');
            }

            loadWishes();
        }

        /* ============================================================
   9. COPY BANK ACCOUNT
   ============================================================ */
        function initBankingToggle() {
            const btn = $('#bankingToggle');
            const cards = $('#bankingCards');
            if (!btn || !cards) return;
            btn.addEventListener('click', () => {
                const isOpen = cards.classList.toggle('open');
                btn.textContent = isOpen ? t('banking_toggle_hide') : t('banking_toggle');
                if (isOpen) {
                    setTimeout(() => {
                        btn.scrollIntoView({behavior: 'smooth', block: 'start'});
                    }, 100);
                }
            });
        }

        function initBankCopy() {
            $$('.bank-card__copy').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const stk = btn.dataset.stk;
                    try {
                        await navigator.clipboard.writeText(stk);
                        btn.classList.add('copied');
                        btn.textContent = t('banking_copied');
                        showToast(t('banking_copied_toast'));
                        setTimeout(() => {
                            btn.classList.remove('copied');
                            btn.textContent = t('banking_copy');
                        }, 2000);
                    } catch {
                        // Fallback
                        const ta = document.createElement('textarea');
                        ta.value = stk;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                        btn.classList.add('copied');
                        btn.textContent = t('banking_copied');
                        showToast(t('banking_copied_toast'));
                        setTimeout(() => {
                            btn.classList.remove('copied');
                            btn.textContent = t('banking_copy');
                        }, 2000);
                    }
                });
            });
        }

        /* ============================================================
   10. RSVP FORM
   ============================================================ */
        function initRSVP() {
            const form = $('#rsvpForm');
            const success = $('#rsvpSuccess');
            const nameInput = $('#rsvpName');
            const phoneInput = $('#rsvpPhone');
            const countEl = $('#rsvpCount');
            const minusBtn = $('#rsvpMinus');
            const plusBtn = $('#rsvpPlus');
            const submitBtn = $('#rsvpSubmit');
            const radios = $$('.rsvp__radio');
            let count = 1;
            let attending = 'yes';

            // Counter
            minusBtn.addEventListener('click', () => {
                const min = attending === 'no' ? 0 : 1;
                if (count > min) {
                    count--;
                    countEl.textContent = count;
                }
            });
            plusBtn.addEventListener('click', () => {
                if (count < 10) {
                    count++;
                    countEl.textContent = count;
                }
            });

            // Radio buttons
            radios.forEach(r => {
                r.addEventListener('click', () => {
                    radios.forEach(x => x.classList.remove('selected'));
                    r.classList.add('selected');
                    r.querySelector('input').checked = true;
                    attending = r.dataset.value;
                    if (attending === 'no') {
                        count = 0;
                        countEl.textContent = count;
                    } else if (count === 0) {
                        count = 1;
                        countEl.textContent = count;
                    }
                });
            });

            // Submit
            submitBtn.addEventListener('click', async () => {
                const name = nameInput.value.trim();
                if (!name) {
                    showToast(t('toast_rsvp_empty'));
                    return;
                }

                const id = currentGuest ? currentGuest.id : '';
                const rsvpData = {
                    id, name,
                    attend_wedding: attending === 'yes',
                    num_guests: count,
                    message: ''
                };
                await API.submitRSVP(rsvpData);

                form.style.display = 'none';
                success.classList.add('visible');
                fireConfetti();
                showToast(t('toast_rsvp_thanks'));
            });

            // Change button
            const changeBtn = $('#rsvpChange');
            changeBtn.addEventListener('click', () => {
                success.classList.remove('visible');
                form.style.display = '';
            });

            // Check if already submitted (from sheet data)
            if (currentGuest && currentGuest.attend_wedding) {
                form.style.display = 'none';
                success.classList.add('visible');
            }
        }

        /* ============================================================
   10b. RSVP POPUP DIALOG (scroll-triggered)
   ============================================================ */
        const RSVP_POPUP_DISMISSED_KEY = 'wedding_rsvp_popup_dismissed';

        function initRsvpPopup() {
            const popup = $('#rsvpPopup');
            const closeBtn = $('#rsvpPopupClose');
            const yesBtn = $('#rsvpPopupYes');
            const noBtn = $('#rsvpPopupNo');
            const laterBtn = $('#rsvpPopupLater');
            const backdrop = $('#rsvpPopupBackdrop');
            const eventsSection = $('[data-section="events"]');
            const rsvpSection = $('.rsvp');
            const rsvpForm = $('#rsvpForm');

            if (!popup || !eventsSection) return;
            if (rsvpSection && rsvpSection.style.display === 'none') return;
            if (currentGuest && currentGuest.attend_wedding) return;

            try {
                if (sessionStorage.getItem(RSVP_POPUP_DISMISSED_KEY) === '1') return;
            } catch (e) { /* ignore */ }

            let shown = false;

            function markDismissed() {
                try { sessionStorage.setItem(RSVP_POPUP_DISMISSED_KEY, '1'); } catch (e) { /* ignore */ }
            }

            function showPopup() {
                if (shown) return;
                shown = true;
                popup.classList.add('visible');
                popup.setAttribute('aria-hidden', 'false');
            }

            function hidePopup() {
                popup.classList.remove('visible');
                popup.setAttribute('aria-hidden', 'true');
                markDismissed();
            }

            function pickAndScroll(value) {
                const targetRadio = $$('.rsvp__radio').find(r => r.dataset.value === value);
                if (targetRadio) targetRadio.click();
                hidePopup();
                setTimeout(() => {
                    const scrollTarget = (rsvpForm && rsvpForm.style.display !== 'none') ? rsvpForm : rsvpSection;
                    if (scrollTarget && scrollTarget.scrollIntoView) {
                        scrollTarget.scrollIntoView({behavior: 'smooth', block: 'center'});
                    }
                }, 280);
            }

            yesBtn.addEventListener('click', () => pickAndScroll('yes'));
            noBtn.addEventListener('click', () => pickAndScroll('no'));
            closeBtn.addEventListener('click', hidePopup);
            laterBtn.addEventListener('click', hidePopup);
            backdrop.addEventListener('click', hidePopup);

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && popup.classList.contains('visible')) hidePopup();
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                        showPopup();
                        observer.unobserve(entry.target);
                    }
                });
            }, {threshold: 0, root: null});

            observer.observe(eventsSection);
        }

        /* ============================================================
   11. ALBUM LIGHTBOX
   ============================================================ */
        function initLightbox() {
            const lightbox = $('#lightbox');
            const closeBtn = $('#lightboxClose');
            const prevBtn = $('#lightboxPrev');
            const nextBtn = $('#lightboxNext');
            const content = $('#lightboxContent');
            const items = $$('.album__item');
            let currentIdx = 0;

            const albumImages = [
                'images/album/1.jpg',
                'images/album/2.jpg',
                'images/album/3.jpg',
                'images/album/4.jpg',
                'images/album/5.jpg',
                'images/album/6.jpg',
                'images/album/7.jpg',
                'images/album/8.jpg',
            ];

            function showPhoto(idx) {
                currentIdx = idx;
                const src = albumImages[idx] || albumImages[0];
                content.style.background = '#000';
                content.innerHTML = `<img src="${src}" alt="Ảnh cưới ${idx + 1}" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:8px">`;
            }

            items.forEach(item => {
                item.addEventListener('click', () => {
                    const idx = parseInt(item.dataset.album, 10);
                    showPhoto(idx);
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });

            prevBtn.addEventListener('click', () => {
                showPhoto((currentIdx - 1 + albumImages.length) % albumImages.length);
            });
            nextBtn.addEventListener('click', () => {
                showPhoto((currentIdx + 1) % albumImages.length);
            });

            function closeLightbox() {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('active')) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            });

            // Swipe support
            let touchStartX = 0;
            lightbox.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, {passive: true});
            lightbox.addEventListener('touchend', (e) => {
                const diff = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? prevBtn.click() : nextBtn.click();
                }
            }, {passive: true});
        }

        /* ============================================================
   12. CONFETTI
   ============================================================ */
        function fireConfetti() {
            const canvas = $('#confettiCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const colors = ['#FFD700', '#DC143C', '#FF69B4', '#FF1493', '#B22222', '#FFB6C1', '#FFA500', '#FFFFFF'];
            const pieces = [];

            for (let i = 0; i < 80; i++) {
                pieces.push({
                    x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.5,
                    y: canvas.height * 0.3,
                    vx: (Math.random() - 0.5) * 12,
                    vy: -(Math.random() * 8 + 4),
                    w: Math.random() * 8 + 4,
                    h: Math.random() * 6 + 3,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 10,
                    gravity: 0.15 + Math.random() * 0.1,
                    opacity: 1
                });
            }

            let frame = 0;

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let active = false;

                pieces.forEach(p => {
                    p.vy += p.gravity;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.99;
                    p.rotation += p.rotSpeed;
                    if (frame > 40) p.opacity -= 0.01;

                    if (p.opacity > 0 && p.y < canvas.height + 20) {
                        active = true;
                        ctx.save();
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.rotation * Math.PI / 180);
                        ctx.globalAlpha = Math.max(0, p.opacity);
                        ctx.fillStyle = p.color;
                        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                        ctx.restore();
                    }
                });

                frame++;
                if (active && frame < 200) {
                    requestAnimationFrame(animate);
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }

            animate();
        }

        /* ============================================================
   14. TOAST NOTIFICATION
   ============================================================ */
        let toastTimer;

        function showToast(msg) {
            clearTimeout(toastTimer);
            toast.textContent = msg;
            toast.classList.add('visible');
            toastTimer = setTimeout(() => toast.classList.remove('visible'), 2500);
        }

        /* ============================================================
   15. UTILITY
   ============================================================ */
        function escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        /* ============================================================
   INIT
   ============================================================ */
        initPersonalization().then(ok => {
            if (!ok) return;
            initParticles();
            initPetals();
            initScrollAnimations();
            initScrollProgress();
            initWishes();
            initBankingToggle();
            initBankCopy();
            initRSVP();
            initRsvpPopup();
            initLightbox();
        });

    })();
