function config() { }
config.settings = {
	"SWIT_VERSION": "1.2.0",
	"MAX_DELTA_TIME": 50,
	"SAFE_AREA_WIDTH": 200,
	"APP_WIDTH": 1024,
	"APP_HEIGHT": 768,
	"APP_FPS": 40,
	"SOUND_PERCENT": 60,
	"ASSETS_PATH": "",
	"LOG": true,
	"USE_TILT": true,
	"USE_CHEATS": true,
	"CHECK_STRINGS": false,
	"SIZE_STRINGS_TYPE_1": "10,40",
	"SIZE_STRINGS_TYPE_2": "5,125",
	"SIZE_STRINGS_TYPE_3": "20,80",
	"SIZE_STRINGS_TYPE_4": "15,50",
	"SIZE_STRINGS_TYPE_5": "50,80",
	"RENDER_MODE": 0,
	"CONSOLE_MODE": 2,
	"WIDE_SCREEN": true,
	"RIGHT_TO_LEFT": false,
	"SHOW_SOCIAL_BUTTONS": false,
	"USE_ONLY_SOUNDJS": false,
	"GAME_NAME_TRACKING": "BigCityGreens",
	"P1_UP": 87,
	"P1_DOWN": 83,
	"P1_FORWARD": 68,
	"P1_BACK": 65,
	"P1_SPECIAL": 32,
	"P2_UP": 38,
	"P2_DOWN": 40,
	"P2_FORWARD": 37,
	"P2_BACK": 39,
	"P2_SPECIAL": 13,
	"VO_FREQUENCY_MIN": 2,
	"VO_FREQUENCY_MAX": 3
};
config.browserSettings = [
	{
		"browserType": "MSIE",
		"platformType": "Win",
		"minVersion": 9
	},
	{
		"browserType": "Opera",
		"platformType": "",
		"minVersion": 12
	},
	{
		"browserType": "Chrome",
		"platformType": "",
		"minVersion": 25
	},
	{
		"browserType": "Firefox",
		"platformType": "",
		"minVersion": 20
	},
	{
		"browserType": "Safari",
		"platformType": "",
		"minVersion": 4
	}
];
config.sounds = [
	{
		"id": "SND_BG_MAINMENU",
		"file": "mus_menu",
		"loops": 0,
		"vol": 0.8,
		"ios": 1,
		"instances": 1,
		"group": 0
	},
	{
		"id": "SND_UI_CLICK",
		"file": "snd_click",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 3,
		"group": 0
	},
	{
		"id": "SND_UI_SCROLL",
		"file": "snd_scroll",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 3,
		"group": 0
	},
	{
		"id": "SND_CLICK_BACK",
		"file": "snd_click_back",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 3,
		"group": 0
	},
	{
		"id": "SND_PICK",
		"file": "snd_pick",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 3,
		"group": 0
	},
	{
		"id": "SND_DESELECT",
		"file": "snd_deselect",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 3,
		"group": 0
	},
	{
		"id": "SND_BG_UI_VS",
		"file": "mus_ui_vs",
		"loops": 0,
		"vol": 0.8,
		"ios": 1,
		"instances": 1,
		"group": 0
	},
	{
		"id": "SND_NEW_ACHIEVEMENT",
		"file": "snd_new_achievement",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 3,
		"group": 0
	},
	{
		"id": "VO_CUTSCENE12",
		"file": "vo_cutscene12",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 0
	},
	{
		"id": "SND_BG_END_GAME",
		"file": "mus_end_game",
		"loops": 0,
		"vol": 0.5,
		"ios": 1,
		"instances": 1,
		"group": 0
	},
	{
		"id": "SND_BG_GAMEPLAY_1",
		"file": "mus_gameplay1",
		"loops": 0,
		"vol": 0.6,
		"ios": 1,
		"instances": 1,
		"group": 1
	},
	{
		"id": "SND_BG_GAMEPLAY_2",
		"file": "mus_gameplay2",
		"loops": 0,
		"vol": 0.8,
		"ios": 1,
		"instances": 1,
		"group": 2
	},
	{
		"id": "SND_BG_GAMEPLAY_3",
		"file": "mus_gameplay3",
		"loops": 0,
		"vol": 0.6,
		"ios": 1,
		"instances": 1,
		"group": 3
	},
	{
		"id": "SND_GOAT_PASS_BY",
		"file": "snd_goat_pass_by",
		"loops": 0,
		"vol": 0.2,
		"ios": 0,
		"instances": 3,
		"group": 3
	},
	{
		"id": "SND_GOAT_CRASHED",
		"file": "snd_goat_crashed",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 3,
		"group": 3
	},
	{
		"id": "SND_BG_GAMEPLAY_4",
		"file": "mus_gameplay4",
		"loops": 0,
		"vol": 0.6,
		"ios": 1,
		"instances": 1,
		"group": 4
	},
	{
		"id": "SND_BG_GAMEPLAY_5",
		"file": "mus_gameplay5",
		"loops": 0,
		"vol": 0.6,
		"ios": 1,
		"instances": 1,
		"group": 5
	},
	{
		"id": "SND_BIRDS_COOING",
		"file": "snd_birds_cooing",
		"loops": 0,
		"vol": 0.8,
		"ios": 0,
		"instances": 2,
		"group": 5
	},
	{
		"id": "SND_BIRDS_FLY_IN",
		"file": "snd_birds_fly_in",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 2,
		"group": 5
	},
	{
		"id": "SND_BIRDS_FLY_OUT",
		"file": "snd_birds_fly_out",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 2,
		"group": 5
	},
	{
		"id": "SND_BG_GAMEPLAY_6",
		"file": "mus_gameplay6",
		"loops": 0,
		"vol": 0.6,
		"ios": 1,
		"instances": 1,
		"group": 6
	},
	{
		"id": "SND_SEWER_LID",
		"file": "snd_sewer_lid",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 4,
		"group": 6
	},
	{
		"id": "SND_SEWER_WATER",
		"file": "snd_sewer_water",
		"loops": 1,
		"vol": 0.2,
		"ios": 0,
		"instances": 2,
		"group": 6
	},
	{
		"id": "SND_SEWER_WATER_LOOP",
		"file": "snd_sewer_water_loop",
		"loops": 0,
		"vol": 0.2,
		"ios": 0,
		"instances": 2,
		"group": 6
	},
	{
		"id": "SND_BG_BOSSBATTLE",
		"file": "mus_bossbattle",
		"loops": 0,
		"vol": 0.6,
		"ios": 1,
		"instances": 1,
		"group": 7
	},
	{
		"id": "SND_BG_GRAMMA",
		"file": "mus_gramma",
		"loops": 0,
		"vol": 0.5,
		"ios": 1,
		"instances": 1,
		"group": 7
	},
	{
		"id": "SND_GRAMMA_BEAM",
		"file": "snd_gramma_beam",
		"loops": 1,
		"vol": 0.8,
		"ios": 1,
		"instances": 1,
		"group": 7
	},
	{
		"id": "SND_GRAMMA_QUAKE",
		"file": "snd_gramma_quake",
		"loops": 1,
		"vol": 0.8,
		"ios": 1,
		"instances": 1,
		"group": 7
	},
	{
		"id": "SND_BG_WIN",
		"file": "mus_win",
		"loops": 1,
		"vol": 0.5,
		"ios": 1,
		"instances": 1,
		"group": 8
	},
	{
		"id": "SND_BG_LOSE",
		"file": "mus_lose",
		"loops": 1,
		"vol": 0.5,
		"ios": 1,
		"instances": 1,
		"group": 8
	},
	{
		"id": "SND_BG_READY",
		"file": "mus_ready",
		"loops": 1,
		"vol": 0.8,
		"ios": 1,
		"instances": 1,
		"group": 8
	},
	{
		"id": "SND_JUMP",
		"file": "snd_jump",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 4,
		"group": 8
	},
	{
		"id": "SND_DOUBLE_JUMP",
		"file": "snd_double_jump",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_EN_BACKDASH",
		"file": "snd_en_backdash",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_AIR_ATTACK",
		"file": "snd_air_attack",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 4,
		"group": 8
	},
	{
		"id": "SND_AIR_ATTACK_HIGH",
		"file": "snd_air_attack_high",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 4,
		"group": 8
	},
	{
		"id": "SND_AIR_ATTACK_LOW",
		"file": "snd_air_attack_low",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 4,
		"group": 8
	},
	{
		"id": "SND_ALT_SPECIAL",
		"file": "snd_alt_special",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_FIGHT",
		"file": "snd_fight",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_HIT_FLOOR",
		"file": "snd_hit_floor",
		"loops": 1,
		"vol": 0.5,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_PLY_BACKDASH",
		"file": "snd_ply_backdash",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 4,
		"group": 8
	},
	{
		"id": "SND_REGULAR_HIT1",
		"file": "snd_regular_hit1",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 4,
		"group": 8
	},
	{
		"id": "SND_REGULAR_HIT2",
		"file": "snd_regular_hit2",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 4,
		"group": 8
	},
	{
		"id": "SND_SPECIAL_HALFWAY",
		"file": "snd_special_halfway",
		"loops": 1,
		"vol": 0.6,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_SPECIAL_FULL",
		"file": "snd_special_full",
		"loops": 1,
		"vol": 0.6,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_ROUND",
		"file": "snd_round",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "SND_SPECIAL",
		"file": "snd_special",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_SPECIAL_HIT",
		"file": "snd_special_hit",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_TIME_OUT",
		"file": "snd_time_out",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "SND_HEALTH_APPEAR",
		"file": "snd_health_appear",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_INVULNERABILITY_ITEM",
		"file": "snd_invulnerability_item",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_HEALTH_PICK",
		"file": "snd_health_pick",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_HAZARD_DOGS",
		"file": "snd_hazard_dogs",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_WARNING",
		"file": "snd_warning",
		"loops": 0,
		"vol": 0.8,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_LAST_HIT",
		"file": "snd_last_hit",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 2,
		"group": 8
	},
	{
		"id": "SND_ROCK_CRACK",
		"file": "snd_rock_crack",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 2,
		"group": 8
	},
	{
		"id": "SND_ROCK_DESTROY",
		"file": "snd_rock_destroy",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 2,
		"group": 8
	},
	{
		"id": "SND_ROCK_HIT",
		"file": "snd_rock_hit",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 2,
		"group": 8
	},
	{
		"id": "SND_SPECIAL_HALF_IMPACT",
		"file": "snd_special_half_impact",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 2,
		"group": 8
	},
	{
		"id": "SND_SPECIAL_FULL_IMPACT",
		"file": "snd_special_full_impact",
		"loops": 1,
		"vol": 0.8,
		"ios": 0,
		"instances": 2,
		"group": 8
	},
	{
		"id": "SND_PERFECT",
		"file": "snd_perfect",
		"loops": 1,
		"vol": 0.35,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_DESTROYED",
		"file": "snd_destroyed",
		"loops": 1,
		"vol": 0.35,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_CHALLENGE_COMPLETED",
		"file": "snd_challenge_completed",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_LIFE_BAR_REFILL",
		"file": "snd_life_bar_refill",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_NEW_CHARACTER",
		"file": "snd_new_character",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_MESSAGE_WIN",
		"file": "snd_message_win",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 3,
		"group": 8
	},
	{
		"id": "SND_CUTSCENE2",
		"file": "mus_cutscene2",
		"loops": 1,
		"vol": 0.8,
		"ios": 1,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE1",
		"file": "vo_cutscene1",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 10
	},
	{
		"id": "VO_CUTSCENE2",
		"file": "vo_cutscene2",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 10
	},
	{
		"id": "VO_CUTSCENE3",
		"file": "vo_cutscene3",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 10
	},
	{
		"id": "VO_CUTSCENE4A",
		"file": "vo_cutscene4a",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 10
	},
	{
		"id": "VO_CUTSCENE4B",
		"file": "vo_cutscene4b",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 10
	},
	{
		"id": "VO_CUTSCENE5A",
		"file": "vo_cutscene5a",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE5B",
		"file": "vo_cutscene5b",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE6A",
		"file": "vo_cutscene6a",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE6B",
		"file": "vo_cutscene6b",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE7A",
		"file": "vo_cutscene7a",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE7B",
		"file": "vo_cutscene7b",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE8",
		"file": "vo_cutscene8",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE9",
		"file": "vo_cutscene9",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE10A",
		"file": "vo_cutscene10a",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE10B",
		"file": "vo_cutscene10b",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE11A",
		"file": "vo_cutscene11a",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CUTSCENE11B",
		"file": "vo_cutscene11b",
		"loops": 1,
		"vol": 1,
		"ios": 0,
		"instances": 1,
		"group": 9
	},
	{
		"id": "VO_CRICKET_BACK0",
		"file": "vo_cricket_back0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_BACK1",
		"file": "vo_cricket_back1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_DIVE0",
		"file": "vo_cricket_dive0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_DIVE1",
		"file": "vo_cricket_dive1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_HURT0",
		"file": "vo_cricket_hurt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_HURT1",
		"file": "vo_cricket_hurt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_JUMP0",
		"file": "vo_cricket_jump0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_JUMP1",
		"file": "vo_cricket_jump1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_SPECIAL0",
		"file": "vo_cricket_special0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_SPECIAL1",
		"file": "vo_cricket_special1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_TACKLE0",
		"file": "vo_cricket_tackle0",
		"loops": 1,
		"vol": 0.7,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_TACKLE1",
		"file": "vo_cricket_tackle1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_TAUNT0",
		"file": "vo_cricket_taunt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_TAUNT1",
		"file": "vo_cricket_taunt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_WIN0",
		"file": "vo_cricket_win0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CRICKET_WIN1",
		"file": "vo_cricket_win1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_BACK0",
		"file": "vo_tilly_back0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_BACK1",
		"file": "vo_tilly_back1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_DIVE0",
		"file": "vo_tilly_dive0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_DIVE1",
		"file": "vo_tilly_dive1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_HURT0",
		"file": "vo_tilly_hurt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_HURT1",
		"file": "vo_tilly_hurt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_JUMP0",
		"file": "vo_tilly_jump0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_JUMP1",
		"file": "vo_tilly_jump1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_SPECIAL0",
		"file": "vo_tilly_special0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_SPECIAL1",
		"file": "vo_tilly_special1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_TACKLE0",
		"file": "vo_tilly_tackle0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_TACKLE1",
		"file": "vo_tilly_tackle1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_TAUNT0",
		"file": "vo_tilly_taunt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_TAUNT1",
		"file": "vo_tilly_taunt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_WIN0",
		"file": "vo_tilly_win0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_TILLY_WIN1",
		"file": "vo_tilly_win1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_BACK0",
		"file": "vo_remy_back0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_BACK1",
		"file": "vo_remy_back1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_DIVE0",
		"file": "vo_remy_dive0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_DIVE1",
		"file": "vo_remy_dive1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_HURT0",
		"file": "vo_remy_hurt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_HURT1",
		"file": "vo_remy_hurt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_JUMP0",
		"file": "vo_remy_jump0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_JUMP1",
		"file": "vo_remy_jump1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_SPECIAL0",
		"file": "vo_remy_special0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_SPECIAL1",
		"file": "vo_remy_special1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_TACKLE0",
		"file": "vo_remy_tackle0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_TACKLE1",
		"file": "vo_remy_tackle1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_TAUNT0",
		"file": "vo_remy_taunt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_TAUNT1",
		"file": "vo_remy_taunt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_WIN0",
		"file": "vo_remy_win0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_REMY_WIN1",
		"file": "vo_remy_win1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_BACK0",
		"file": "vo_bill_back0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_BACK1",
		"file": "vo_bill_back1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_DIVE0",
		"file": "vo_bill_dive0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_DIVE1",
		"file": "vo_bill_dive1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_HURT0",
		"file": "vo_bill_hurt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_HURT1",
		"file": "vo_bill_hurt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_JUMP0",
		"file": "vo_bill_jump0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_JUMP1",
		"file": "vo_bill_jump1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_SPECIAL0",
		"file": "vo_bill_special0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_SPECIAL1",
		"file": "vo_bill_special1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_TACKLE0",
		"file": "vo_bill_tackle0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_TACKLE1",
		"file": "vo_bill_tackle1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_TAUNT0",
		"file": "vo_bill_taunt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_TAUNT1",
		"file": "vo_bill_taunt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_WIN0",
		"file": "vo_bill_win0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_BILL_WIN1",
		"file": "vo_bill_win1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_BACK0",
		"file": "vo_gramma_back0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_BACK1",
		"file": "vo_gramma_back1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_DIVE0",
		"file": "vo_gramma_dive0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_DIVE1",
		"file": "vo_gramma_dive1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_HURT0",
		"file": "vo_gramma_hurt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_HURT1",
		"file": "vo_gramma_hurt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_JUMP0",
		"file": "vo_gramma_jump0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_JUMP1",
		"file": "vo_gramma_jump1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_SPECIAL0",
		"file": "vo_gramma_special0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_SPECIAL1",
		"file": "vo_gramma_special1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_TACKLE0",
		"file": "vo_gramma_tackle0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_TACKLE1",
		"file": "vo_gramma_tackle1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_TAUNT0",
		"file": "vo_gramma_taunt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_TAUNT1",
		"file": "vo_gramma_taunt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_WIN0",
		"file": "vo_gramma_win0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_GRAMMA_WIN1",
		"file": "vo_gramma_win1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_BACK0",
		"file": "vo_chicken_back0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_BACK1",
		"file": "vo_chicken_back1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_DIVE0",
		"file": "vo_chicken_dive0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_DIVE1",
		"file": "vo_chicken_dive1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_HURT0",
		"file": "vo_chicken_hurt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_HURT1",
		"file": "vo_chicken_hurt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_JUMP0",
		"file": "vo_chicken_jump0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_JUMP1",
		"file": "vo_chicken_jump1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_SPECIAL0",
		"file": "vo_chicken_special0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_SPECIAL1",
		"file": "vo_chicken_special1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_TACKLE0",
		"file": "vo_chicken_tackle0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_TACKLE1",
		"file": "vo_chicken_tackle1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_TAUNT0",
		"file": "vo_chicken_taunt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_TAUNT1",
		"file": "vo_chicken_taunt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_WIN0",
		"file": "vo_chicken_win0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_CHICKEN_WIN1",
		"file": "vo_chicken_win1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_BACK0",
		"file": "vo_pig_back0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_BACK1",
		"file": "vo_pig_back1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_DIVE0",
		"file": "vo_pig_dive0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_DIVE1",
		"file": "vo_pig_dive1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_HURT0",
		"file": "vo_pig_hurt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_HURT1",
		"file": "vo_pig_hurt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_JUMP0",
		"file": "vo_pig_jump0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_JUMP1",
		"file": "vo_pig_jump1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_SPECIAL0",
		"file": "vo_pig_special0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_SPECIAL1",
		"file": "vo_pig_special1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_TACKLE0",
		"file": "vo_pig_tackle0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_TACKLE1",
		"file": "vo_pig_tackle1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_TAUNT0",
		"file": "vo_pig_taunt0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_TAUNT1",
		"file": "vo_pig_taunt1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_WIN0",
		"file": "vo_pig_win0",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "VO_PIG_WIN1",
		"file": "vo_pig_win1",
		"loops": 1,
		"vol": 0.9,
		"ios": 0,
		"instances": 1,
		"group": 8
	},
	{
		"id": "SND_BG_BILL",
		"file": "mus_bill",
		"loops": 0,
		"vol": 0.3,
		"ios": 1,
		"instances": 1,
		"group": 11
	}
];
config.bullets = [
	{
		"skin": ['ani_player_cricket_bullet', 'ani_player_cricket2_bullet'],
		"speed": 1.15,
		"damage": [10,15],
		"rotation": 0.000
	},
	{
		"skin": ['ani_player_tilly_bullet','ani_player_tilly2_bullet'],
		"speed": 1.15,
		"damage": [10,15],
		"rotation": 0.000
	},
	{
		"skin": ['ani_player_pig_bullet','ani_player_pig2_bullet'],
		"speed": 1.15,
		"damage": [10,15],
		"rotation": 0.000
	},
	{
		"skin": ['ani_player_chicken_bullet', 'ani_player_chicken2_bullet'],
		"speed": 1.15,
		"damage": [10,15],
		"rotation": 0.000
	},
	{
		"skin": ['ani_player_remy_bullet','ani_player_remy2_bullet'],
		"speed": 1.15,
		"damage": [10,15],
		"rotation": 0.000
	},
	{
		"skin": ['ani_player_bill_bullet','ani_player_bill2_bullet'],
		"speed": 1.15,
		"damage": [10,15],
		"rotation": 0.000
	},
	{
		"skin": ['ani_player_gramma_bullet','ani_player_gramma2_bullet'],
		"speed": 1.15,
		"damage": [10,15],
		"rotation": 0.000
	},
	{
		"skin": ['ani_player_gramma_bullet','ani_player_gramma2_bullet'],
		"speed": 1.15,
		"damage": [10,15],
		"rotation": 0.000
	}
];
config.heroes = [
	{
		"name": "Cricket",
		"skin": ['ani_player_cricket','ani_player_cricket2'],
		"gravity": 4.03,
		"maxVy": 2,
		"jumpImpulse": 1.61,
		"djumpImpulse": 1.3,
		"gravFactor": 0,
		"backSpeed": 1.08,
		"backFriction": 2.76,
		"diveSpeed": 1,
		"diveAngle": 45,
		"diveYOffset": 60,
		"maxHp": 33,
		"diveBar": 12,
		"damage": 8,
		"punchDmg": 5,
		"bulletId": 0,
		"mediaId": 3,
		"charaId": 0,
		"diveSound": 1,
		"shadowScale": 1,
		"numCostumes": 1
	},
	{
		"name": "Tilly",
		"skin": ['ani_player_tilly', 'ani_player_tilly2'],
		"gravity": 4.03,
		"maxVy": 2,
		"jumpImpulse": 1.61,
		"djumpImpulse": 1.3,
		"gravFactor": 0,
		"backSpeed": 1.08,
		"backFriction": 2.76,
		"diveSpeed": 1,
		"diveAngle": 45,
		"diveYOffset": 75,
		"maxHp": 33,
		"diveBar": 12,
		"damage": 8,
		"punchDmg": 5,
		"bulletId": 1,
		"mediaId": 10,
		"charaId": 1,
		"diveSound": 1,
		"shadowScale": 1,
		"numCostumes": 1
	},
	{
		"name": "Pig",
		"skin": ['ani_player_pig', 'ani_player_pig2'],
		"gravity": 3.8,
		"maxVy": 2,
		"jumpImpulse": 1.44,
		"djumpImpulse": 1.3,
		"gravFactor": 0,
		"backSpeed": 0.92,
		"backFriction": 2.19,
		"diveSpeed": 0.9,
		"diveAngle": 50,
		"diveYOffset": 75,
		"maxHp": 37,
		"diveBar": 12,
		"damage": 7,
		"punchDmg": 5,
		"bulletId": 2,
		"mediaId": 7,
		"charaId": 2,
		"diveSound": 1,
		"shadowScale": 1.3,
		"numCostumes": 0
	},
	{
		"name": "Chicken",
		"skin": ['ani_player_chicken', 'ani_player_chicken2'],
		"gravity": 5.18,
		"maxVy": 2,
		"jumpImpulse": 1.84,
		"djumpImpulse": 1.4,
		"gravFactor": 0,
		"backSpeed": 1.08,
		"backFriction": 2.76,
		"diveSpeed": 1.2,
		"diveAngle": 37,
		"diveYOffset": 50,
		"maxHp": 28,
		"diveBar": 10,
		"damage": 6,
		"punchDmg": 4,
		"bulletId": 3,
		"mediaId": 2,
		"charaId": 3,
		"diveSound": 0,
		"shadowScale": 1,
		"numCostumes": 0
	},
	{
		"name": "Remy",
		"skin": ['ani_player_remy', 'ani_player_remy2'],
		"gravity": 4.26,
		"maxVy": 2,
		"jumpImpulse": 1.61,
		"djumpImpulse": 1.3,
		"gravFactor": 0,
		"backSpeed": 1.38,
		"backFriction": 3.45,
		"diveSpeed": 1.1,
		"diveAngle": 45,
		"diveYOffset": 70,
		"maxHp": 33,
		"diveBar": 15,
		"damage": 8,
		"punchDmg": 5,
		"bulletId": 4,
		"mediaId": 8,
		"charaId": 4,
		"diveSound": 1,
		"shadowScale": 1,
		"numCostumes": 1
	},
	{
		"name": "Bill",
		"skin": ['ani_player_bill', 'ani_player_bill2'],
		"gravity": 3.8,
		"maxVy": 2,
		"jumpImpulse": 1.55,
		"djumpImpulse": 1.3,
		"gravFactor": 0,
		"backSpeed": 1.5,
		"backFriction": 3.4,
		"diveSpeed": 0.85,
		"diveAngle": 50,
		"diveYOffset": 100,
		"maxHp": 42,
		"diveBar": 12,
		"damage": 9,
		"punchDmg": 8,
		"bulletId": 5,
		"mediaId": 0,
		"charaId": 5,
		"diveSound": 2,
		"shadowScale": 1.8,
		"numCostumes": 1
	},
	{
		"name": "Gramma",
		"skin": ['ani_player_gramma', 'ani_player_gramma2'],
		"gravity": 4.3,
		"maxVy": 2,
		"jumpImpulse": 1.7,
		"djumpImpulse": 1.3,
		"gravFactor": 0,
		"backSpeed": 1.08,
		"backFriction": 2.76,
		"diveSpeed": 1.15,
		"diveAngle": 40,
		"diveYOffset": 80,
		"maxHp": 36,
		"diveBar": 11,
		"damage": 7,
		"punchDmg": 5,
		"bulletId": 6,
		"mediaId": 5,
		"charaId": 6,
		"diveSound": 1,
		"shadowScale": 1.4,
		"numCostumes": 1
	},
	{
		"name": "GrammaNinja",
		"skin": ['ani_player_gramma', 'ani_player_gramma2'],
		"gravity": 4.3,
		"maxVy": 2,
		"jumpImpulse": 1.7,
		"djumpImpulse": 1.3,
		"gravFactor": 0,
		"backSpeed": 1.08,
		"backFriction": 2.76,
		"diveSpeed": 1.4,
		"diveAngle": 40,
		"diveYOffset": 80,
		"maxHp": 42,
		"diveBar": 11,
		"damage": 8,
		"punchDmg": 5,
		"bulletId": 6,
		"mediaId": 5,
		"charaId": 6,
		"diveSound": 1,
		"shadowScale": 1.4,
		"numCostumes": 1
	},
	{
		"name": "Chicken",
		"skin": ['ani_player_chicken', 'ani_player_chicken2'],
		"gravity": 4.26,
		"maxVy": 2,
		"jumpImpulse": 1.61,
		"djumpImpulse": 1.3,
		"gravFactor": 0,
		"backSpeed": 1.08,
		"backFriction": 2.76,
		"diveSpeed": 1.1,
		"diveAngle": 37,
		"diveYOffset": 50,
		"maxHp": 26,
		"diveBar": 11,
		"damage": 6,
		"punchDmg": 4,
		"bulletId": 3,
		"mediaId": 2,
		"charaId": 3,
		"diveSound": 0,
		"shadowScale": 1,
		"numCostumes": 0
	},
	{
		"name": "Bill",
		"skin": ['ani_player_bill', 'ani_player_bill2'],
		"gravity": 3.68,
		"maxVy": 2,
		"jumpImpulse": 1.5,
		"djumpImpulse": 1.3,
		"gravFactor": 0,
		"backSpeed": 1.5,
		"backFriction": 3.4,
		"diveSpeed": 0.9,
		"diveAngle": 50,
		"diveYOffset": 100,
		"maxHp": 70,
		"diveBar": 12,
		"damage": 12,
		"punchDmg": 8,
		"bulletId": 5,
		"mediaId": 0,
		"charaId": 5,
		"diveSound": 2,
		"shadowScale": 1.8,
		"numCostumes": 1
	}
];
config.aiConfig = [
	{
		"name": "easy",
		"g2g": [3,1,1,1,1],
		"g2a": [2,1,2,1,1],
		"a2g": [1,0.2,0,0.7,1],
		"a2a": [3,1,0,1,1],
		"corner": [2,3,0,0.5,1],
		"approach": [1.5,3,0,0,1],
		"pollTime": 500,
		"safeDistance": 400,
		"diveChance": 0.2,
		"tackleChance": 0.2,
		"gEvadeChance": 0.2,
		"halfSpChance": 0.7,
		"instantActionWait": 200,
		"inputDelay": 280,
		"recoveryTime": 3500
	},
	{
		"name": "easy",
		"g2g": [3,0.9,1,0.9,1],
		"g2a": [2.3,0.9,2,0.8,1],
		"a2g": [1,0.2,0,0.7,1],
		"a2a": [3,1,0,1.1,1],
		"corner": [2.2,2.7,0,0.5,1],
		"approach": [2,3,0,0,1],
		"pollTime": 450,
		"safeDistance": 400,
		"diveChance": 0.3,
		"tackleChance": 0.3,
		"gEvadeChance": 0.3,
		"halfSpChance": 0.7,
		"instantActionWait": 180,
		"inputDelay": 250,
		"recoveryTime": 3300
	},
	{
		"name": "easy",
		"g2g": [3,0.8,1,0.7,1],
		"g2a": [2.6,0.8,2,0.7,1],
		"a2g": [1,0.3,0,0.7,1],
		"a2a": [3,1,0,1.2,1],
		"corner": [2.3,2.5,0,0.4,1],
		"approach": [2.2,2.7,0,0,1],
		"pollTime": 400,
		"safeDistance": 400,
		"diveChance": 0.4,
		"tackleChance": 0.4,
		"gEvadeChance": 0.4,
		"halfSpChance": 0.7,
		"instantActionWait": 150,
		"inputDelay": 230,
		"recoveryTime": 3000
	},
	{
		"name": "medium",
		"g2g": [3,0.7,1,0.6,1],
		"g2a": [3,0.7,2,0.6,1],
		"a2g": [1,0.3,0,0.4,1],
		"a2a": [3,1,0,1.4,1],
		"corner": [2.4,2.4,0,0.4,1],
		"approach": [2.5,2.5,0,0,1],
		"pollTime": 340,
		"safeDistance": 400,
		"diveChance": 0.5,
		"tackleChance": 0.5,
		"gEvadeChance": 0.5,
		"halfSpChance": 0.6,
		"instantActionWait": 130,
		"inputDelay": 200,
		"recoveryTime": 3000
	},
	{
		"name": "medium",
		"g2g": [3,0.6,1,0.5,1],
		"g2a": [3.5,0.6,2,0.4,1],
		"a2g": [1,0.4,0,0.4,1],
		"a2a": [3,1,0,1.5,1],
		"corner": [2.5,2.3,0,0.3,1],
		"approach": [2.7,2.2,0,0,1],
		"pollTime": 280,
		"safeDistance": 400,
		"diveChance": 0.5,
		"tackleChance": 0.5,
		"gEvadeChance": 0.6,
		"halfSpChance": 0.6,
		"instantActionWait": 100,
		"inputDelay": 160,
		"recoveryTime": 2500
	},
	{
		"name": "medium",
		"g2g": [3,0.5,1,0.5,1],
		"g2a": [3.9,0.5,2,0,1],
		"a2g": [1,0.5,0,0.4,1],
		"a2a": [3,1,0,1.6,1],
		"corner": [2.6,2.2,0,0.3,1],
		"approach": [3,2,0,0.2,1],
		"pollTime": 220,
		"safeDistance": 400,
		"diveChance": 0.6,
		"tackleChance": 0.5,
		"gEvadeChance": 0.7,
		"halfSpChance": 0.6,
		"instantActionWait": 80,
		"inputDelay": 130,
		"recoveryTime": 2300
	},
	{
		"name": "hard",
		"g2g": [3,5,1,0.5,1],
		"g2a": [4.2,5.3,2,0,1],
		"a2g": [1,0.6,0,0.5,1],
		"a2a": [3,1,0,1.7,1],
		"corner": [2.7,2.1,0,0.2,1],
		"approach": [3.3,1.7,0,0.2,1],
		"pollTime": 300,
		"safeDistance": 400,
		"diveChance": 0.8,
		"tackleChance": 1,
		"gEvadeChance": 0.8,
		"halfSpChance": 0.5,
		"instantActionWait": 60,
		"inputDelay": 100,
		"recoveryTime": 2000
	},
	{
		"name": "hard",
		"g2g": [3, 0.2, 1, 0.5, 1],
		"g2a": [4.5,0.2,2,0,1],
		"a2g": [1,0.7,0,0.5,1],
		"a2a": [3,1,0,1.9,1],
		"corner": [3,2,0,0.2,1],
		"approach": [3.7,1.3,0,0.2,1],
		"pollTime": 120,
		"safeDistance": 400,
		"diveChance": 0.8,
		"tackleChance": 0.8,
		"gEvadeChance": 0.8,
		"halfSpChance": 0.5,
		"instantActionWait": 50,
		"inputDelay": 70,
		"recoveryTime": 1800
	},
	{
		"name": "hard",
		"g2g": [3,0.1,1,0.5,1],
		"g2a": [5,0,2,0,1],
		"a2g": [1,0.8,0,0.5,1],
		"a2a": [3,1,0,2,1],
		"corner": [3,2,0,0,1],
		"approach": [4,1,0,0,1],
		"pollTime": 100,
		"safeDistance": 400,
		"diveChance": 0.9,
		"tackleChance": 0.9,
		"gEvadeChance": 0.9,
		"halfSpChance": 0.4,
		"instantActionWait": 30,
		"inputDelay": 50,
		"recoveryTime": 1500
	},
	{
		"name": "getthebeans",
		"g2g": [3,0,1,0,1],
		"g2a": [3,0,0.2,0,1],
		"a2g": [1,5,0,0,1],
		"a2a": [1,3,0,0,1],
		"corner": [1,2,0,0,1],
		"approach": [1,2,0,0,1],
		"pollTime": 200,
		"safeDistance": 400,
		"diveChance": 0.9,
		"tackleChance": 0,
		"gEvadeChance": 0.7,
		"halfSpChance": 1,
		"instantActionWait": 100,
		"inputDelay": 70,
		"recoveryTime": 2500
	},
	{
		"name": "billeasy",
		"g2g": [3,3,1,0.7,1],
		"g2a": [2.6,2,2,0.7,1],
		"a2g": [1,0.3,0,0.7,1],
		"a2a": [3,1,0,1.2,1],
		"corner": [2.3,2.5,0,0.4,1],
		"approach": [2.2,2.7,0,0,1],
		"pollTime": 400,
		"safeDistance": 400,
		"diveChance": 0.4,
		"tackleChance": 0.4,
		"gEvadeChance": 0.4,
		"halfSpChance": 0.7,
		"instantActionWait": 150,
		"inputDelay": 230,
		"recoveryTime": 3000
	},
	{
		"name": "billmedium",
		"g2g": [3,4,1,0.5,1],
		"g2a": [3.9,3.5,2,0,1],
		"a2g": [1,0.5,0,0.4,1],
		"a2a": [3,1,0,1.6,1],
		"corner": [2.6,2.2,0,0.3,1],
		"approach": [3,2,0,0.2,1],
		"pollTime": 220,
		"safeDistance": 400,
		"diveChance": 0.6,
		"tackleChance": 0.5,
		"gEvadeChance": 0.7,
		"halfSpChance": 0.6,
		"instantActionWait": 80,
		"inputDelay": 130,
		"recoveryTime": 2300
	},
	{
		"name": "billhard",
		"g2g": [3,5,1,0.5,1],
		"g2a": [4.2,5.3,2,0,1],
		"a2g": [1,0.6,0,0.5,1],
		"a2a": [3,1,0,1.7,1],
		"corner": [2.7,2.1,0,0.2,1],
		"approach": [3.3,1.7,0,0.2,1],
		"pollTime": 300,
		"safeDistance": 400,
		"diveChance": 0.8,
		"tackleChance": 1,
		"gEvadeChance": 0.8,
		"halfSpChance": 0.5,
		"instantActionWait": 60,
		"inputDelay": 100,
		"recoveryTime": 2000
	}
];
config.battleConfig = [
	{
		"name": "standard",
		"iniDistance": 400,
		"iniNumTaps": 15,
		"maxNumTaps": 15,
		"tapIncRatio": 0,
		"parryStun": 1200,
		"repositionDist": 700,
		"repositionSpeed": 1,
		"globalGravity": 5,
		"backSlideSpeed": 0.8,
		"roundTime": 60000,
		"modHitG": 0.28,
		"modHitSp": 0.06,
		"spChargeTime": 200,
		"recoveryDmg": 6,
		"scale": 1.2
	}
];
config.camera = {
	"cameraOffsetY": 0,
	"maxVerticalSpace": 1.40,
	"zoomScaleNormalHit": 1.00,
	"zoomScaleFinalHit": 1.15,
	"screenFreezeTime": 350,
	"screenFreezeTimeFinal": 700
};
config.modifiers = {
	"raccoonsIntervalTime": 5000,
	"raccoonStandTime": -1,
	"raccoonInvencibilityTime": 5000,
	"animalsFarmTotal": 3,
	"animalsFarmWarningTime": 1500,
	"animalsFarmDistanceBtwn": 90,
	"animalsFarmDamage": 10,
	"animalsFarmSpeed": 1.10,
	"coffeeIntervalTime": 6500,
	"coffeeStandTime": -1,
	"coffeeBoostTime": 5000,
	"coffeeBoostJump": 1.40,
	"coffeeBoostDive": 1.70,
	"coffeeBoostDash": 1.70,
	"manholesIntervalTime": 5000,
	"manholeStandTime": -1,
	"statueHealth": 120,
	"robotIntervalTime": 6500,
	"robotSpeed": 0.40,
	"robotHPbonus": 13,
	"pidgeonsIntervalTime": 5000,
	"pidgeonsStandTime": 500,
	"pidgeonsSpeed": 0.90,
	"pidgeonsHPDamage": 10
};
config.stages = [
	{
		"name": "house_front",
		"modifierId": 4
	},
	{
		"name": "big_coffee",
		"modifierId": 1
	},
	{
		"name": "subway",
		"modifierId": 5
	},
	{
		"name": "zoo",
		"modifierId": 0
	},
	{
		"name": "street",
		"modifierId": 2
	},
	{
		"name": "park",
		"modifierId": 3
	},
	{
		"name": "house_back",
		"modifierId": -1
	}
];
config.story = [
	{
		"name": "easy",
		"fightOrder": [8,2,4,3,0,5,6],
		"difficultyOrder": [0,0,1,-1,1,10,3],
		"stageOrder": [6,1,2,3,4,5,0],
		"hpMult": 0.8,
		"dmgMult": 0.9
	},
	{
		"name": "medium",
		"fightOrder": [8,2,4,3,0,5,6],
		"difficultyOrder": [1,2,3,-1,3,11,5],
		"stageOrder": [6,1,2,3,4,5,0],
		"hpMult": 1,
		"dmgMult": 1
	},
	{
		"name": "hard",
		"fightOrder": [3,2,4,3,0,5,6],
		"difficultyOrder": [3,4,5,-1,5,12,7],
		"stageOrder": [6,1,2,3,4,5,0],
		"hpMult": 1.15,
		"dmgMult": 1.15
	}
];
config.cutscenes = [
	{
		"name": "intro",
		"stringName": "STR_CUTSCENE_INTRO"
	}
];
config.challenges = [
	{
		"name": "none",
		"aiDifficulty": 0,
		"stage": 0,
		"opponent": 0,
		"player": 0
	},
	{
		"name": "Half-done",
		"aiDifficulty": 3,
		"stage": 5,
		"opponent": 2,
		"player": 5
	},
	{
		"name": "Basic mode ",
		"aiDifficulty": 8,
		"stage": 3,
		"opponent": 3,
		"player": 2
	},
	{
		"name": "Gotta get the beans",
		"aiDifficulty": 9,
		"stage": 4,
		"opponent": 0,
		"player": 4
	},
	{
		"name": "It’s rush hour",
		"aiDifficulty": 2,
		"stage": 1,
		"opponent": 2,
		"player": 5
	},
	{
		"name": "C-C-C-COMBO!!",
		"aiDifficulty": 1,
		"stage": 0,
		"opponent": 4,
		"player": 1
	},
	{
		"name": "Toughie",
		"aiDifficulty": 4,
		"stage": 5,
		"opponent": 5,
		"player": 2
	},
	{
		"name": "Stampede",
		"aiDifficulty": 7,
		"stage": 0,
		"opponent": 0,
		"player": 1
	},
	{
		"name": "Bite the dust",
		"aiDifficulty": 4,
		"stage": 2,
		"opponent": 4,
		"player": 2
	},
	{
		"name": "Endure!",
		"aiDifficulty": 8,
		"stage": 4,
		"opponent": 5,
		"player": 3
	},
	{
		"name": "Vitamin packed",
		"aiDifficulty": 4,
		"stage": 0,
		"opponent": 1,
		"player": 2
	},
	{
		"name": "Weak knees",
		"aiDifficulty": 5,
		"stage": 4,
		"opponent": 4,
		"player": 3
	},
	{
		"name": "Keep your distance",
		"aiDifficulty": 9,
		"stage": 1,
		"opponent": 0,
		"player": 4
	},
	{
		"name": "The floor is lava",
		"aiDifficulty": 5,
		"stage": 3,
		"opponent": 2,
		"player": 1
	},
	{
		"name": "No big deal",
		"aiDifficulty": 7,
		"stage": 5,
		"opponent": 9,
		"player": 0
	},
	{
		"name": "End it for good",
		"aiDifficulty": 8,
		"stage": 0,
		"opponent": 7,
		"player": 0
	}
];
config.challValues = {
	"defaultChallenge": 14,
	"lavaDamage": 0.05,
	"enemyRegen": 0.02,
	"comboHitStandTime": 3000,
	"comboHitVanishTime": 500,
	"comboHitBonusSP": 7
};
