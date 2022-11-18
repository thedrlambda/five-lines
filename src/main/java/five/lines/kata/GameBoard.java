package five.lines.kata;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.Stack;
import javax.swing.*;

import static five.lines.kata.Tile.*;
import static java.awt.event.KeyEvent.*;

public class GameBoard extends JPanel implements ActionListener {
    private static final int TILE_SIZE = 30;
    private static final Stack<Input> inputs = new Stack<>();

    private final Tile[][] map = {
            {UNBREAKABLE, UNBREAKABLE, UNBREAKABLE, UNBREAKABLE, UNBREAKABLE, UNBREAKABLE, UNBREAKABLE, UNBREAKABLE},
            {UNBREAKABLE, PLAYER, AIR, FLUX, FLUX, UNBREAKABLE, AIR, UNBREAKABLE},
            {UNBREAKABLE, STONE, UNBREAKABLE, BOX, FLUX, UNBREAKABLE, AIR, UNBREAKABLE},
            {UNBREAKABLE, KEY1, STONE, FLUX, FLUX, UNBREAKABLE, AIR, UNBREAKABLE},
            {UNBREAKABLE, STONE, FLUX, FLUX, FLUX, LOCK1, AIR, UNBREAKABLE},
            {UNBREAKABLE, UNBREAKABLE, UNBREAKABLE, UNBREAKABLE, UNBREAKABLE, UNBREAKABLE, UNBREAKABLE, UNBREAKABLE},
    };

    private int playerx = 1;
    private int playery = 1;

    public GameBoard() {
        this.setPreferredSize(new Dimension(240, 180));
        this.setBackground(Color.WHITE);
        this.setFocusable(true);
        this.addKeyListener(new MyKey());
        Timer timer = new Timer(33, this);
        timer.start();
    }

    public void paintComponent(Graphics graphic) {
        super.paintComponent(graphic);
        draw(graphic);
    }

    private void boardUpdate() {
        while (inputs.size() > 0) {
            Input current = inputs.pop();
            if (current==Input.LEFT)
                moveHorizontal(-1);
            else if (current==Input.RIGHT)
                moveHorizontal(1);
            else if (current==Input.UP)
                moveVertical(-1);
            else if (current==Input.DOWN)
                moveVertical(1);
        }

        for (int y = map.length - 1; y >= 0; y--) {
            for (int x = 0; x < map[y].length; x++) {
                if ((map[y][x]==Tile.STONE || map[y][x]==Tile.FALLING_STONE)
                        && map[y + 1][x]==Tile.AIR) {
                    map[y + 1][x] = Tile.FALLING_STONE;
                    map[y][x] = Tile.AIR;
                } else if ((map[y][x]==Tile.BOX || map[y][x]==Tile.FALLING_BOX)
                        && map[y + 1][x]==Tile.AIR) {
                    map[y + 1][x] = Tile.FALLING_BOX;
                    map[y][x] = Tile.AIR;
                } else if (map[y][x]==Tile.FALLING_STONE) {
                    map[y][x] = Tile.STONE;
                } else if (map[y][x]==Tile.FALLING_BOX) {
                    map[y][x] = Tile.BOX;
                }
            }
        }
    }

    private void moveVertical(int dy) {
        if (map[playery + dy][playerx]==Tile.FLUX
                || map[playery + dy][playerx]==Tile.AIR) {
            moveToTile(playerx, playery + dy);
        } else if (map[playery + dy][playerx]==Tile.KEY1) {
            remove(Tile.LOCK1);
            moveToTile(playerx, playery + dy);
        } else if (map[playery + dy][playerx]==Tile.KEY2) {
            remove(Tile.LOCK2);
            moveToTile(playerx, playery + dy);
        }
    }

    private void moveHorizontal(int dx) {
        if (map[playery][playerx + dx]==Tile.FLUX
                || map[playery][playerx + dx]==Tile.AIR) {
            moveToTile(playerx + dx, playery);
        } else if ((map[playery][playerx + dx]==Tile.STONE
                || map[playery][playerx + dx]==Tile.BOX)
                && map[playery][playerx + dx + dx]==Tile.AIR
                && map[playery + 1][playerx + dx]!=Tile.AIR) {
            map[playery][playerx + dx + dx] = map[playery][playerx + dx];
            moveToTile(playerx + dx, playery);
        } else if (map[playery][playerx + dx]==Tile.KEY1) {
            remove(Tile.LOCK1);
            moveToTile(playerx + dx, playery);
        } else if (map[playery][playerx + dx]==Tile.KEY2) {
            remove(Tile.LOCK2);
            moveToTile(playerx + dx, playery);
        }

    }

    private void remove(Tile tile) {
        for (int y = 0; y < map.length; y++) {
            for (int x = 0; x < map[y].length; x++) {
                if (map[y][x]==tile) {
                    map[y][x] = Tile.AIR;
                }
            }
        }
    }

    private void moveToTile(int newx, int newy) {
        map[playery][playerx] = Tile.AIR;
        map[newy][newx] = Tile.PLAYER;
        playerx = newx;
        playery = newy;
    }

    private void draw(Graphics g) {
        for (int y = 0; y < map.length; y++) {
            for (int x = 0; x < map[y].length; x++) {
                if (map[y][x]==Tile.FLUX)
                    g.setColor(Color.GREEN);
                else if (map[y][x]==UNBREAKABLE)
                    g.setColor(Color.BLACK);
                else if (map[y][x]==Tile.STONE || map[y][x]==Tile.FALLING_STONE)
                    g.setColor(Color.LIGHT_GRAY);
                else if (map[y][x]==Tile.BOX || map[y][x]==Tile.FALLING_BOX)
                    g.setColor(Color.PINK);
                else if (map[y][x]==Tile.KEY1 || map[y][x]==Tile.LOCK1)
                    g.setColor(Color.YELLOW);
                else if (map[y][x]==Tile.KEY2 || map[y][x]==Tile.LOCK2)
                    g.setColor(Color.ORANGE);

                if (map[y][x]!=Tile.AIR && map[y][x]!=Tile.PLAYER)
                    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }

        // Draw player
        g.setColor(Color.RED);
        g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        boardUpdate();
        repaint();
    }

    private static class MyKey extends KeyAdapter {
        @Override
        public void keyPressed(KeyEvent e) {
            if (e.getKeyCode()==VK_LEFT || e.getKeyCode()==VK_A) inputs.push(Input.LEFT);
            else if (e.getKeyCode()==VK_UP || e.getKeyCode()==VK_W) inputs.push(Input.UP);
            else if (e.getKeyCode()==VK_RIGHT || e.getKeyCode()==VK_D) inputs.push(Input.RIGHT);
            else if (e.getKeyCode()==VK_DOWN || e.getKeyCode()==VK_S) inputs.push(Input.DOWN);
        }
    }
}
