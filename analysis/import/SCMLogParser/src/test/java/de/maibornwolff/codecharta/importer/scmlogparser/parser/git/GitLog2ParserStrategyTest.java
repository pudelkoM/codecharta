package de.maibornwolff.codecharta.importer.scmlogparser.parser.git;

import de.maibornwolff.codecharta.importer.scmlogparser.parser.LogParserStrategy;
import de.maibornwolff.codecharta.importer.scmlogparser.parser.ParserStrategyContractTest;
import de.maibornwolff.codecharta.model.input.Modification;
import org.assertj.core.util.Lists;
import org.junit.Before;
import org.junit.Test;

import java.util.List;
import java.util.stream.Stream;

import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;

public class GitLog2ParserStrategyTest extends ParserStrategyContractTest {

    private static final List<String> FULL_COMMIT = asList(
            "commit ca1fe2ba3be4",
            "Author: TheAuthor <mail@example.com>",
            "Date:   Tue May 9 19:57:57 2017 +0200",
            "    the commit message",
            "0 10 src/Main.java",
            "2 1 src/Main.java",
            "20 0 src/Util.java");

    private GitLog2ParserStrategy parserStrategy;

    @Before
    public void setup() {
        parserStrategy = new GitLog2ParserStrategy();
    }

    @Override
    protected List<String> getFullCommit() {
        return FULL_COMMIT;
    }

    @Override
    protected LogParserStrategy getLogParserStrategy() {
        return parserStrategy;
    }

    @Override
    protected Stream<String> getTwoCommitsAsStraem() {
        List<String> twoCommits = Lists.newArrayList("commit");
        twoCommits.addAll(FULL_COMMIT);
        twoCommits.add("commit abcdef");
        twoCommits.addAll(FULL_COMMIT);
        twoCommits.add("commit");
        return twoCommits.stream();
    }

    @Test
    public void parsesFilenameFromFileMetadata() {
        String fileMetadata = "0 10\t src/Main.java";
        Modification modification = parserStrategy.parseModification(fileMetadata);
        assertThat(modification.getFilename()).isEqualTo("src/Main.java");
    }

    @Test
    public void parsesFilenamesFromUnusualFileMetadata() {
        assertThat(parserStrategy.parseModification("0\t10\tsrc/Main.java").getFilename())
                .isEqualTo("src/Main.java");
    }

    @Test
    public void parsesAuthorWithoutEmail() {
        String author = parserStrategy.parseAuthor("Author: TheAuthor");
        assertThat(author).isEqualTo("TheAuthor");
    }

    @Test
    public void parsesAuthorFromAuthorAndEmail() {
        String author = parserStrategy.parseAuthor("Author: TheAuthor <mail@example.com>");
        assertThat(author).isEqualTo("TheAuthor");
    }

}
