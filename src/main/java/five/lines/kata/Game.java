package five.lines.kata;


import java.awt.*;
import javax.swing.*;

public class Game {
    public static void main(String[] args) throws Exception {
        new GameFrame();
    }

    private static class GameFrame extends JFrame {
        public GameFrame() throws HeadlessException {
            this.add(new GameBoard());
            this.setTitle("Five-lines-kata");
            this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            this.setResizable(false);
            this.pack();
            this.setVisible(true);
            this.setLocationRelativeTo(null);
        }
    }
}
