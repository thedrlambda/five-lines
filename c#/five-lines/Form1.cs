using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Timer = System.Windows.Forms.Timer;

namespace five_lines
{
    public enum Tile
    {
        AIR,
        FLUX,
        UNBREAKABLE,
        PLAYER,
        STONE,
        FALLING_STONE,
        BOX,
        FALLING_BOX,
        KEY1,
        LOCK1,
        KEY2,
        LOCK2
    }

    public enum Input
    {
        UP,
        DOWN,
        LEFT,
        RIGHT
    }

    public partial class Form1 : Form
    {
        private int[,] _map;
        private int _playerx;
        private int _playery;
        private Queue<Input> _inputs;

        const int TILE_SIZE = 30;
        const int FPS = 30;
        const int SLEEP = 1000 / FPS;

        const int LEFT_KEY = 37;
        const int UP_KEY = 38;
        const int RIGHT_KEY = 39;
        const int DOWN_KEY = 40;


        public Form1()
        {
            InitializeComponent();

            _playerx = 1;
            _playery = 1;
            _map = new int[,]
            {
                {2, 2, 2, 2, 2, 2, 2, 2},
                {2, 3, 0, 1, 1, 2, 0, 2},
                {2, 4, 2, 6, 1, 2, 0, 2},
                {2, 8, 4, 1, 1, 2, 0, 2},
                {2, 4, 1, 1, 1, 9, 0, 2},
                {2, 2, 2, 2, 2, 2, 2, 2}
            };

            _inputs = new Queue<Input>();

            this.KeyDown += Form1_KeyDown;

            Timer GameTimer = new Timer();
            GameTimer.Interval = SLEEP;
            GameTimer.Tick += gameLoop;
            GameTimer.Start();
        }

        public void remove(Tile tile)
        {
            for (var y = 0; y < _map.GetLength(0); y++)
            {
                for (var x = 0; x < _map.GetLength(1); x++)
                {
                    if (_map[y, x] == (int) tile)
                    {
                        _map[y, x] = (int) Tile.AIR;
                    }
                }
            }
        }

        public void moveToTile(int newx, int newy)
        {
            _map[_playery, _playerx] = (int) Tile.AIR;
            _map[newy, newx] = (int) Tile.PLAYER;
            _playerx = newx;
            _playery = newy;
        }

        public void moveHorizontal(int dx)
        {
            if (_map[_playery, _playerx + dx] == (int) Tile.FLUX
                || _map[_playery, _playerx + dx] == (int) Tile.AIR)
            {
                moveToTile(_playerx + dx, _playery);
            }
            else if ((_map[_playery, _playerx + dx] == (int) Tile.STONE
                      || _map[_playery, _playerx + dx] == (int) Tile.BOX)
                     && _map[_playery, _playerx + dx + dx] == (int) Tile.AIR
                     && _map[_playery + 1, _playerx + dx] != (int) Tile.AIR)
            {
                _map[_playery, _playerx + dx + dx] = _map[_playery, _playerx + dx];
                moveToTile(_playerx + dx, _playery);
            }
            else if (_map[_playery, _playerx + dx] == (int) Tile.KEY1)
            {
                remove(Tile.LOCK1);
                moveToTile(_playerx + dx, _playery);
            }
            else if (_map[_playery, _playerx + dx] == (int) Tile.KEY2)
            {
                remove(Tile.LOCK2);
                moveToTile(_playerx + dx, _playery);
            }
        }

        public void moveVertical(int dy)
        {
            if (_map[_playery + dy, _playerx] == (int) Tile.FLUX
                || _map[_playery + dy, _playerx] == (int) Tile.AIR)
            {
                moveToTile(_playerx, _playery + dy);
            }
            else if (_map[_playery + dy, _playerx] == (int) Tile.KEY1)
            {
                remove(Tile.LOCK1);
                moveToTile(_playerx, _playery + dy);
            }
            else if (_map[_playery + dy, _playerx] == (int) Tile.KEY2)
            {
                remove(Tile.LOCK2);
                moveToTile(_playerx, _playery + dy);
            }
        }

        public void update()
        {
            while (_inputs.Count > 0)
            {
                var current = _inputs.Dequeue();
                if (current == Input.LEFT)
                    moveHorizontal(-1);
                else if (current == Input.RIGHT)
                    moveHorizontal(1);
                else if (current == Input.UP)
                    moveVertical(-1);
                else if (current == Input.DOWN)
                    moveVertical(1);
            }

            for (var y = _map.GetLength(0) - 1; y >= 0; y--)
            {
                for (var x = 0; x < _map.GetLength(1); x++)
                {
                    if ((_map[y, x] == (int) Tile.STONE || _map[y, x] == (int) Tile.FALLING_STONE)
                        && _map[y + 1, x] == (int) Tile.AIR)
                    {
                        _map[y + 1, x] = (int) Tile.FALLING_STONE;
                        _map[y, x] = (int) Tile.AIR;
                    }
                    else if ((_map[y, x] == (int) Tile.BOX || _map[y, x] == (int) Tile.FALLING_BOX)
                             && _map[y + 1, x] == (int) Tile.AIR)
                    {
                        _map[y + 1, x] = (int) Tile.FALLING_BOX;
                        _map[y, x] = (int) Tile.AIR;
                    }
                    else if (_map[y, x] == (int) Tile.FALLING_STONE)
                    {
                        _map[y, x] = (int) Tile.STONE;
                    }
                    else if (_map[y, x] == (int) Tile.FALLING_BOX)
                    {
                        _map[y, x] = (int) Tile.BOX;
                    }
                }
            }
        }

        public void draw()
        {
            var formGraphics = CreateGraphics();
            
            // Draw _map
            for (var y = 0; y < _map.GetLength(0); y++)
            {
                for (var x = 0; x < _map.GetLength(1); x++)
                {
                    var g = new Color();
                    if (_map[y, x] == (int) Tile.FLUX)
                        g = ColorTranslator.FromHtml("#ccffcc");
                    else if (_map[y, x] == (int) Tile.UNBREAKABLE)
                        g = ColorTranslator.FromHtml("#999999");
                    else if (_map[y, x] == (int) Tile.STONE || _map[y, x] == (int) Tile.FALLING_STONE)
                        g = ColorTranslator.FromHtml("#0000cc");
                    else if (_map[y, x] == (int) Tile.BOX || _map[y, x] == (int) Tile.FALLING_BOX)
                        g = ColorTranslator.FromHtml("#8b4513");
                    else if (_map[y, x] == (int) Tile.KEY1 || _map[y, x] == (int) Tile.LOCK1)
                        g = ColorTranslator.FromHtml("#ffcc00");
                    else if (_map[y, x] == (int) Tile.KEY2 || _map[y, x] == (int) Tile.LOCK2)
                        g = ColorTranslator.FromHtml("#00ccff");
                    else if (_map[y, x] == (int) Tile.AIR)
                        g = ColorTranslator.FromHtml("#ffffff");

                    var brush = new SolidBrush(g);


                    if (_map[y, x] != (int) Tile.PLAYER)
                    {
                        formGraphics.FillRectangle(brush, new Rectangle(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE));
                    }

                    brush.Dispose();
                }
            }

            // Draw player
            var playerColor = ColorTranslator.FromHtml("#ff0000");
            var playerBrush = new SolidBrush(playerColor);
            formGraphics.FillRectangle(playerBrush, _playerx * TILE_SIZE, _playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            playerBrush.Dispose();
            formGraphics.Dispose();
        }

        public void gameLoop(object sender, EventArgs e)
        {
            {
                update();
                draw();
            }
        }


        void Form1_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Left || e.KeyCode == Keys.A) _inputs.Enqueue(Input.LEFT);
            else if (e.KeyCode == Keys.Up || e.KeyCode == Keys.W) _inputs.Enqueue(Input.UP);
            else if (e.KeyCode == Keys.Right || e.KeyCode == Keys.D) _inputs.Enqueue(Input.RIGHT);
            else if (e.KeyCode == Keys.Down || e.KeyCode == Keys.S) _inputs.Enqueue(Input.DOWN);

            e.Handled = true;
        }
    }
}