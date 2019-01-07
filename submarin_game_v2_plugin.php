<?php
/*
 * @wordpress-plugin
 * Plugin Name: Submarin Game V2 Plugin
 * Description: This is Submarin Game. Short Code is "insert_submarin".
 * Version: 2.0
 * Author: Seiichi Nukayama
 */

function add_files() {
    wp_enqueue_script('submarinGame_js', plugins_url('submarinGame.js', __FILE__), array(), '1.0', true);
    wp_enqueue_style('css-submarin', plugins_url('submarin.css', __FILE__));
}
add_action('wp_enqueue_scripts', 'add_files');

function add_module_to_script( $tag, $handle, $src ) {
	if ('submarinGame_js' === $handle) {
		$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
	}
	return $tag;
}
add_filter('script_loader_tag', 'add_module_to_script', 10, 3);

function play() {

    ob_start();
?>
<div class="row">
    <div class="col-md-8">
        <div id="submarin-game">
            <header>
                <h1>潜水艦ゲーム</h1>
            </header>
            <article>
                <button id="howto-btn">あそびかた</button>
			    <aside class="des" id="des-howto-play">
                    <header class="clearfix">
                        <img id="close-des" src="close.gif" alt="close">
                        <h1>あそびかた</h1>
                    </header>
				    <p>この海域には、敵潜水艦が3隻潜んでいます。<br>
				        潜水艦は、1隻で3つのセルを占有しています。<br>
				        あなたに課せられた任務は、敵潜水艦を全隻撃沈することです。<br>
				        49個の各セルをマウス（指）でクリックすることで、敵潜水艦を攻撃できます。
				        もし、20回以下の攻撃で任務を完了することができれば、優秀といえます。<br>
				        さあ、頑張ってください。</p>
			    </aside>
                <table>
                    <tr>
                        <th></th>
                        <th>A</th>
                        <th>B</th>
                        <th>C</th>
                        <th>D</th>
                        <th>E</th>
                        <th>F</th>
                        <th>G</th>
                    </tr>
                    <?php for ($i = 1; $i <= 7; $i++) { ?>
                        <tr>
                            <th><?php echo $i; ?></th>
                            <?php for ($j = 1; $j <= 7; $j++) {  ?>
                                <?php $idx = mb_substr("ABCDEFG", ($j-1), 1) . (String)$i; ?>
                                <td class="select" id="<?php echo $idx; ?>"></td>
                            <?php } ?>
                        </tr>
                    <?php } ?>

                </table>
                <section class="score">
                	<div id="kekka-illust">
                		<div class="dotCom" id="dotCom1">
                			<span class="dotComName"></span><!-- SeaTiger -->
                			<span class="dotComKekka"></span>
                		</div>
                		<div class="dotCom" id="dotCom2">
                			<span class="dotComName"></span><!-- Papiyon -->
                			<span class="dotComKekka"></span>
                		</div>
                		<div class="dotCom" id="dotCom3">
                			<span class="dotComName"></span><!-- Mermaid -->
                			<span class="dotComKekka"></span>
                		</div>
                	</div>
                    <p id="kekka"></p>
                    <div id="mes1"></div>
                    <div id="mes2"></div>
                    <button id="replay">REPLAY</button>
                </section>
                <section class="teki">
                    <p id = "teki-kekka"></p>
                    <div id="teki-mes1"></div>
                    <div id="teki-mes2"></div>
                </section>
                <button id="start-set-btn">あなたの潜水艦を配置する</button>
                <section class="set-players-ship">
                    <p>
                        あなたの3隻の潜水艦を配置してください。<br>
                        1隻の潜水艦につき3つのセルが必要です。<br>
                        3つのセルは、縦でも横でもかまいません。
                    </p>
                    <form id="players-set">
                        <div class="clearfix">
                            <div class="ship-name">Odyssey:</div>
                            <div class="ship-cell">
                                1:<input type="text" id="ody1" list="ody1list">
                                <datalist id="ody1list">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </datalist>
                                2:<input type="text" id="ody2" list="ody2list">
                                <datalist id="ody2list">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </datalist>
                                3:<input type="text" id="ody3" list="ody3list">
                                <datalist id="ody3list">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </datalist>
                            </div>
                        </div>
                        <div class="clearfix">
                            <div class="ship-name">Poseidon:</div>
                            <div class="ship-cell">
                                1:<input type="text" id="pos1" list="pos1list">
                                <datalist id="pos1list">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </datalist>
                                2:<input type="text" id="pos2" list="pos2list">
                                <datalist id="pos2list">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </datalist>
                                3:<input type="text" id="pos3" list="pos3list">
                                <datalist id="pos3list">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </datalist>
                            </div>
                        </div>
                        <div class="clearfix">
                            <div class="ship-name">Hermes:</div>
                            <div class="ship-cell">
                                1:<input type="text" id="her1" list="her1list">
                                <datalist id="her1list">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </datalist>
                                2:<input type="text" id="her2" list="her2list">
                                <datalist id="her2list">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </datalist>
                                3:<input type="text" id="her3" list="her3list">
                                <datalist id="her3list">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </datalist>
                            </div>
                        </div>
                    </form>
                    <button id="set-ok">決定</button>
                </section>
                <section id="players-ship">
                    <div>Oddysey &nbsp;&nbsp;      : <span id="ship1"></span>
                        &nbsp;<span id="kekka-Ody"></span>
                    </div>
                    <div>Poseidon &nbsp;           : <span id="ship2"></span>
                        &nbsp;<span id="kekka-Pos"></span>
                    </div>
                    <div>Hermes &nbsp;&nbsp;&nbsp; : <span id="ship3"></span>
                        &nbsp;<span id="kekka-Her"></span>
                    </div>
                </section>
            </article>
        </div><!-- #submarin-game -->
    </div><!-- .col-md-8 -->
</div><!-- .row -->
<?php
return ob_get_clean();
}
add_shortcode('insert_submarin', 'play');

